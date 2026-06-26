import { useCallback, useEffect, useMemo, useState } from 'react'
import HealthContext from './HealthContext'
import {
  getProfile,
  getTodayLog,
  updateProfile as updateProfileApi,
  updateTodayLogApi,
} from '../services/api'

const initialProfile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  goal: '',
  sleepTarget: '',
  waterTarget: '',
  activityLevel: '',
  photo: '',
}

const initialTodayLog = {
  water: 0,
  sleepHours: 0,
  mood: '',
  steps: 0,
  notes: '',
}

const initialBmiData = {
  height: '',
  weight: '',
  bmi: '',
  category: '',
}

const defaultReminders = [
  { id: 1, title: 'Drink water', time: '09:00 AM', type: 'Hydration', active: true },
  { id: 2, title: 'Sleep on time', time: '10:30 PM', type: 'Sleep', active: true },
]

function HealthProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile)
  const [todayLog, setTodayLog] = useState(initialTodayLog)
  const [bmiData, setBmiData] = useState(() => {
    const saved = localStorage.getItem('smarthealth-bmi')
    return saved ? JSON.parse(saved) : initialBmiData
  })
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('smarthealth-reminders')
    return saved ? JSON.parse(saved) : defaultReminders
  })
  const [symptomEntries, setSymptomEntries] = useState(() => {
    const saved = localStorage.getItem('smarthealth-symptoms')
    return saved ? JSON.parse(saved) : []
  })
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to SmartHealth AI',
      message: 'Your health dashboard is ready to track hydration, sleep, and profile changes.',
      type: 'info',
      isRead: false,
      time: 'Just now',
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('smarthealth-bmi', JSON.stringify(bmiData))
  }, [bmiData])

  useEffect(() => {
    localStorage.setItem('smarthealth-reminders', JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    localStorage.setItem('smarthealth-symptoms', JSON.stringify(symptomEntries))
  }, [symptomEntries])

  const addNotification = useCallback(({ title, message, type = 'info' }) => {
    const newNotification = {
      id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      message,
      type,
      isRead: false,
      time: 'Just now',
    }

    setNotifications((current) => [newNotification, ...current])
  }, [])

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        isRead: true,
      }))
    )
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadHealthData = async () => {
      try {
        const [profileResult, logResult] = await Promise.all([getProfile(), getTodayLog()])

        if (!isMounted) return

        if (profileResult?.success && profileResult?.data) {
          const nextProfile = {
            name: profileResult.data.name || '',
            age: profileResult.data.age || '',
            height: profileResult.data.height || '',
            weight: profileResult.data.weight || '',
            goal: profileResult.data.goal || '',
            sleepTarget: profileResult.data.sleepTarget || '',
            waterTarget: profileResult.data.waterTarget || '',
            activityLevel: profileResult.data.activityLevel || '',
            photo: profileResult.data.photo || '',
          }

          setProfile(nextProfile)

          if (!bmiData.height && !bmiData.weight && nextProfile.height && nextProfile.weight) {
            const heightInMeters = Number(nextProfile.height) / 100
            const bmiValue = Number(nextProfile.weight) / (heightInMeters * heightInMeters)

            let category = ''
            if (bmiValue < 18.5) category = 'Underweight'
            else if (bmiValue < 25) category = 'Healthy weight'
            else if (bmiValue < 30) category = 'Overweight'
            else category = 'Obesity'

            setBmiData({
              height: nextProfile.height,
              weight: nextProfile.weight,
              bmi: bmiValue.toFixed(1),
              category,
            })
          }
        }

        if (logResult?.success && logResult?.data) {
          setTodayLog({
            water: logResult.data.water || 0,
            sleepHours: logResult.data.sleepHours || 0,
            mood: logResult.data.mood || '',
            steps: logResult.data.steps || 0,
            notes: logResult.data.notes || '',
          })
        }
      } catch (error) {
        console.error('Failed to load health data', error)
        if (isMounted) {
          addNotification({
            title: 'Data load failed',
            message: 'We could not load your saved health data.',
            type: 'error',
          })
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadHealthData()
    return () => {
      isMounted = false
    }
  }, [addNotification, bmiData.height, bmiData.weight])

  const updateProfile = useCallback(
    async (newProfileData) => {
      try {
        const result = await updateProfileApi(newProfileData)

        if (result?.success && result?.data) {
          const nextProfile = {
            name: result.data.name || '',
            age: result.data.age || '',
            height: result.data.height || '',
            weight: result.data.weight || '',
            goal: result.data.goal || '',
            sleepTarget: result.data.sleepTarget || '',
            waterTarget: result.data.waterTarget || '',
            activityLevel: result.data.activityLevel || '',
            photo: result.data.photo || '',
          }

          setProfile(nextProfile)

          if (nextProfile.height && nextProfile.weight) {
            const heightInMeters = Number(nextProfile.height) / 100
            const bmiValue = Number(nextProfile.weight) / (heightInMeters * heightInMeters)

            let category = ''
            if (bmiValue < 18.5) category = 'Underweight'
            else if (bmiValue < 25) category = 'Healthy weight'
            else if (bmiValue < 30) category = 'Overweight'
            else category = 'Obesity'

            setBmiData({
              height: nextProfile.height,
              weight: nextProfile.weight,
              bmi: bmiValue.toFixed(1),
              category,
            })
          }

          addNotification({
            title: 'Profile updated',
            message: 'Your profile changes were saved successfully.',
            type: 'success',
          })
        } else {
          addNotification({
            title: 'Profile update failed',
            message: 'Your profile could not be saved.',
            type: 'error',
          })
        }

        return result
      } catch (error) {
        console.error('Profile update failed', error)
        addNotification({
          title: 'Profile update failed',
          message: 'A server error occurred while saving your profile.',
          type: 'error',
        })

        return {
          success: false,
          message: 'Failed to update profile',
        }
      }
    },
    [addNotification]
  )

  const updateTodayLog = useCallback(
    async (newLogData) => {
      try {
        const result = await updateTodayLogApi(newLogData)

        if (result?.success && result?.data) {
          setTodayLog({
            water: result.data.water || 0,
            sleepHours: result.data.sleepHours || 0,
            mood: result.data.mood || '',
            steps: result.data.steps || 0,
            notes: result.data.notes || '',
          })

          if (Object.prototype.hasOwnProperty.call(newLogData, 'water')) {
            addNotification({
              title: 'Hydration updated',
              message: `Today's water intake is now ${result.data.water} glass${result.data.water !== 1 ? 'es' : ''}.`,
              type: 'success',
            })
          }

          if (Object.prototype.hasOwnProperty.call(newLogData, 'sleepHours')) {
            addNotification({
              title: 'Sleep updated',
              message: `Today's sleep log is now ${Number(result.data.sleepHours).toFixed(1)} hours.`,
              type: 'success',
            })
          }
        } else {
          addNotification({
            title: 'Daily log update failed',
            message: 'Your health log could not be updated.',
            type: 'error',
          })
        }

        return result
      } catch (error) {
        console.error('Daily log update failed', error)
        addNotification({
          title: 'Daily log update failed',
          message: 'A server error occurred while updating your tracker.',
          type: 'error',
        })

        return {
          success: false,
          message: 'Failed to update daily log',
        }
      }
    },
    [addNotification]
  )

  const updateBmiData = useCallback(
    ({ height, weight }) => {
      const h = Number(height)
      const w = Number(weight)

      if (!h || !w || h <= 0 || w <= 0) return

      const heightInMeters = h / 100
      const bmiValue = w / (heightInMeters * heightInMeters)

      let category = ''
      if (bmiValue < 18.5) category = 'Underweight'
      else if (bmiValue < 25) category = 'Healthy weight'
      else if (bmiValue < 30) category = 'Overweight'
      else category = 'Obesity'

      setBmiData({
        height: String(height),
        weight: String(weight),
        bmi: bmiValue.toFixed(1),
        category,
      })

      addNotification({
        title: 'BMI updated',
        message: `Your BMI is ${bmiValue.toFixed(1)} (${category}).`,
        type: 'success',
      })
    },
    [addNotification]
  )

  const addReminder = useCallback(
    ({ title, time, type }) => {
      if (!title?.trim() || !time?.trim()) return

      const newReminder = {
        id: Date.now(),
        title: title.trim(),
        time: time.trim(),
        type,
        active: true,
      }

      setReminders((current) => [newReminder, ...current])

      addNotification({
        title: 'Reminder added',
        message: `${title.trim()} was added to your reminders.`,
        type: 'success',
      })
    },
    [addNotification]
  )

  const toggleReminder = useCallback((id) => {
    setReminders((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    )
  }, [])

  const deleteReminder = useCallback(
    (id) => {
      setReminders((current) => current.filter((item) => item.id !== id))

      addNotification({
        title: 'Reminder deleted',
        message: 'A reminder was removed from your list.',
        type: 'info',
      })
    },
    [addNotification]
  )

  const saveSymptomEntry = useCallback(
    ({ symptom, severity, duration, notes }) => {
      if (!symptom?.trim()) return

      const newEntry = {
        id: Date.now(),
        symptom: symptom.trim(),
        severity,
        duration: duration.trim(),
        notes: notes.trim(),
        date: new Date().toLocaleString(),
      }

      setSymptomEntries((current) => [newEntry, ...current])

      addNotification({
        title: 'Symptom saved',
        message: `${symptom.trim()} was added to your symptom log.`,
        type: severity === 'Severe' ? 'error' : 'success',
      })
    },
    [addNotification]
  )

  const clearSymptoms = useCallback(() => {
    setSymptomEntries([])

    addNotification({
      title: 'Symptoms cleared',
      message: 'Your symptom log has been cleared.',
      type: 'info',
    })
  }, [addNotification])

  const value = useMemo(
    () => ({
      profile,
      todayLog,
      bmiData,
      reminders,
      symptomEntries,
      notifications,
      isLoading,
      updateProfile,
      updateTodayLog,
      updateBmiData,
      addReminder,
      toggleReminder,
      deleteReminder,
      saveSymptomEntry,
      clearSymptoms,
      addNotification,
      markNotificationsRead,
    }),
    [
      profile,
      todayLog,
      bmiData,
      reminders,
      symptomEntries,
      notifications,
      isLoading,
      updateProfile,
      updateTodayLog,
      updateBmiData,
      addReminder,
      toggleReminder,
      deleteReminder,
      saveSymptomEntry,
      clearSymptoms,
      addNotification,
      markNotificationsRead,
    ]
  )

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
}

export default HealthProvider