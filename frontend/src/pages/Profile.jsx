import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  ImagePlus,
  Moon,
  PencilLine,
  Save,
  Target,
  UserRound,
  Waves,
  XCircle,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

const LETTERS_ONLY_REGEX = /^[A-Za-z ]+$/

function Profile() {
  const { profile, updateProfile, updateTodayLog } = useHealth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const displayProfile = useMemo(
    () => ({
      name: profile?.name || '',
      age: profile?.age || '',
      height: profile?.height || '',
      weight: profile?.weight || '',
      goal: profile?.goal || '',
      sleepTarget: profile?.sleepTarget || '',
      waterTarget: profile?.waterTarget || '',
      activityLevel: profile?.activityLevel || 'Moderate',
      photo: profile?.photo || '',
    }),
    [profile]
  )

  const [formData, setFormData] = useState(displayProfile)
  const [photoPreview, setPhotoPreview] = useState(displayProfile.photo || '')

  useEffect(() => {
    if (!isEditing) {
      setFormData(displayProfile)
      setPhotoPreview(displayProfile.photo || '')
      setFieldErrors({})
    }
  }, [displayProfile, isEditing])

  const resetForm = () => {
    setFormData(displayProfile)
    setPhotoPreview(displayProfile.photo || '')
    setFieldErrors({})
  }

  const validateField = (name, rawValue) => {
    const value = String(rawValue ?? '').trim()

    if (
      name === 'name' ||
      name === 'goal'
    ) {
      if (!value) return 'This field is required.'
      if (!LETTERS_ONLY_REGEX.test(value)) return 'Only letters and spaces are allowed.'
      return ''
    }

    if (name === 'age') {
      if (!value) return 'Age is required.'
      const age = Number(value)
      if (!Number.isFinite(age) || !Number.isInteger(age)) return 'Enter a valid whole number.'
      if (age < 1) return 'Age must be at least 1.'
      if (age > 120) return 'Age must be 120 or below.'
      return ''
    }

    if (name === 'height') {
      if (!value) return 'Height is required.'
      const height = Number(value)
      if (!Number.isFinite(height)) return 'Enter a valid number.'
      if (height <= 0) return 'Height must be greater than 0.'
      if (height > 300) return 'Enter a realistic height.'
      return ''
    }

    if (name === 'weight') {
      if (!value) return 'Weight is required.'
      const weight = Number(value)
      if (!Number.isFinite(weight)) return 'Enter a valid number.'
      if (weight <= 0) return 'Weight must be greater than 0.'
      if (weight > 500) return 'Enter a realistic weight.'
      return ''
    }

    if (name === 'sleepTarget') {
      if (!value) return 'Sleep target is required.'
      const sleepTarget = Number(value)
      if (!Number.isFinite(sleepTarget)) return 'Enter a valid number.'
      if (sleepTarget <= 0) return 'Sleep target must be greater than 0.'
      if (sleepTarget > 24) return 'Sleep target must be 24 or below.'
      return ''
    }

    if (name === 'waterTarget') {
      if (!value) return 'Water target is required.'
      const waterTarget = Number(value)
      if (!Number.isFinite(waterTarget) || !Number.isInteger(waterTarget)) {
        return 'Enter a valid whole number.'
      }
      if (waterTarget <= 0) return 'Water target must be greater than 0.'
      if (waterTarget > 50) return 'Enter a realistic water target.'
      return ''
    }

    if (name === 'activityLevel') {
      if (!value) return 'Activity level is required.'
      return ''
    }

    return ''
  }

  const validateAllFields = () => {
    const nextErrors = {
      name: validateField('name', formData.name),
      age: validateField('age', formData.age),
      height: validateField('height', formData.height),
      weight: validateField('weight', formData.weight),
      goal: validateField('goal', formData.goal),
      sleepTarget: validateField('sleepTarget', formData.sleepTarget),
      waterTarget: validateField('waterTarget', formData.waterTarget),
      activityLevel: validateField('activityLevel', formData.activityLevel),
    }

    setFieldErrors(nextErrors)
    return !Object.values(nextErrors).some(Boolean)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    let nextValue = value

    if (name === 'name' || name === 'goal') {
      nextValue = value.replace(/[^A-Za-z ]/g, '')
    }

    if (name === 'age' || name === 'height' || name === 'weight' || name === 'waterTarget') {
      nextValue = value.replace(/[^0-9]/g, '')
    }

    if (name === 'sleepTarget') {
      nextValue = value.replace(/[^0-9.]/g, '')
      const parts = nextValue.split('.')
      if (parts.length > 2) {
        nextValue = `${parts[0]}.${parts.slice(1).join('')}`
      }
    }

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }))

    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, nextValue),
    }))

    if (statusMessage) {
      setStatusMessage('')
      setStatusType('')
    }
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please upload an image file only.')
      setStatusType('error')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPhotoPreview(result)
      setFormData((current) => ({
        ...current,
        photo: result,
      }))
      setStatusMessage('')
      setStatusType('')
    }

    reader.readAsDataURL(file)
  }

  const handleEditClick = () => {
    resetForm()
    setStatusMessage('')
    setStatusType('')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!validateAllFields()) {
      setStatusMessage('Please fill all fields correctly before saving.')
      setStatusType('error')
      return
    }

    const previousWaterTarget = String(profile?.waterTarget || '')
    const newWaterTarget = String(formData.waterTarget || '')
    const previousSleepTarget = String(profile?.sleepTarget || '')
    const newSleepTarget = String(formData.sleepTarget || '')

    const cleanedData = {
      name: formData.name.trim(),
      age: String(Number(formData.age)),
      height: String(Number(formData.height)),
      weight: String(Number(formData.weight)),
      goal: formData.goal.trim(),
      sleepTarget: String(Number(formData.sleepTarget)),
      waterTarget: String(Number(formData.waterTarget)),
      activityLevel: formData.activityLevel,
      photo: formData.photo || '',
    }

    setIsSaving(true)
    setStatusMessage('')
    setStatusType('')

    try {
      const result = await updateProfile(cleanedData)

      if (result?.success) {
        const resetPayload = {}

        if (previousWaterTarget !== newWaterTarget) {
          resetPayload.water = 0
        }

        if (previousSleepTarget !== newSleepTarget) {
          resetPayload.sleepHours = 0
        }

        if (Object.keys(resetPayload).length > 0) {
          await updateTodayLog(resetPayload)
        }

        setStatusMessage('Profile updated successfully.')
        setStatusType('success')
        setIsEditing(false)
      } else {
        setStatusMessage('Profile update failed.')
        setStatusType('error')
      }
    } catch {
      setStatusMessage('Error saving profile.')
      setStatusType('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    setStatusMessage('')
    setStatusType('')
    setIsEditing(false)
  }

  const healthAreas = [
    {
      title: 'Hydration goal',
      value: `${displayProfile.waterTarget || '-'} glasses / day`,
      icon: Waves,
    },
    {
      title: 'Sleep target',
      value: `${displayProfile.sleepTarget || '-'} hours`,
      icon: Moon,
    },
    {
      title: 'Primary focus',
      value: displayProfile.goal || '-',
      icon: Target,
    },
  ]

  const inputClass = (fieldName) =>
    `w-full rounded-[18px] border px-4 py-3 text-[var(--color-text)] outline-none transition focus:ring-2 ${
      fieldErrors[fieldName]
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
        : 'border-[var(--color-border)] bg-[var(--color-surface-2)] focus:border-black/30 focus:ring-black/10'
    }`

  const statusBox =
    statusMessage && statusType ? (
      <div
        className={`flex items-start gap-3 rounded-[20px] border px-4 py-4 ${
          statusType === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-800'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {statusType === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
        <div>
          <p className="text-sm font-semibold">
            {statusType === 'success' ? 'Success' : 'Error'}
          </p>
          <p className="text-sm">{statusMessage}</p>
        </div>
      </div>
    ) : null

  if (isEditing) {
    return (
      <section className="space-y-5 pt-2">
        {statusBox}

        <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-indigo-200 bg-indigo-100 text-indigo-900 shadow-sm">
              <PencilLine size={28} />
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Edit profile</p>
              <h1 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
                Update your health setup
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Fill every field correctly before saving your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col items-center gap-3 rounded-[24px] border border-black/5 bg-[var(--color-surface-2)] p-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-100 text-indigo-900 shadow-sm">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={34} />
                )}
              </div>

              <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-50">
                <ImagePlus size={16} />
                <span>Upload DP</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                Full name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass('name')}
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Age
                </label>
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Enter age"
                  className={inputClass('age')}
                />
                {fieldErrors.age ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.age}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Activity level
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className={inputClass('activityLevel')}
                >
                  <option value="">Select level</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                </select>
                {fieldErrors.activityLevel ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.activityLevel}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Height (cm)
                </label>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Enter height"
                  className={inputClass('height')}
                />
                {fieldErrors.height ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.height}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Weight (kg)
                </label>
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Enter weight"
                  className={inputClass('weight')}
                />
                {fieldErrors.weight ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.weight}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                Health goal
              </label>
              <input
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Enter health goal"
                className={inputClass('goal')}
              />
              {fieldErrors.goal ? (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.goal}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Sleep target (hours)
                </label>
                <input
                  name="sleepTarget"
                  value={formData.sleepTarget}
                  onChange={handleChange}
                  inputMode="decimal"
                  placeholder="Enter sleep target"
                  className={inputClass('sleepTarget')}
                />
                {fieldErrors.sleepTarget ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.sleepTarget}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Water target (glasses)
                </label>
                <input
                  name="waterTarget"
                  value={formData.waterTarget}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Enter water target"
                  className={inputClass('waterTarget')}
                />
                {fieldErrors.waterTarget ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.waterTarget}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-[20px] border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} className="text-white" />
                <span className="text-white">{isSaving ? 'Saving...' : 'Save profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-5 pt-2">
      {statusBox}

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] border border-indigo-200 bg-indigo-100 text-indigo-900 shadow-sm">
            {displayProfile.photo ? (
              <img src={displayProfile.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserRound size={28} />
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Health profile</p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
              {displayProfile.name || 'Your profile'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Your profile helps SmartHealth AI generate practical recommendations based on your
              routine, goals, and daily patterns.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEditClick}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[18px] bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98]"
        >
          <PencilLine size={16} className="text-white" />
          <span className="text-white">Edit profile</span>
        </button>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Basic details</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">Personal metrics</h2>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-100 p-2.5 text-rose-900 shadow-sm">
            <HeartPulse size={18} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <span className="text-sm text-[var(--color-text-muted)]">Age</span>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {displayProfile.age || '-'} years
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <span className="text-sm text-[var(--color-text-muted)]">Height</span>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {displayProfile.height || '-'} cm
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <span className="text-sm text-[var(--color-text-muted)]">Weight</span>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {displayProfile.weight || '-'} kg
            </span>
          </div>

          <div className="flex items-center justify-between rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <span className="text-sm text-[var(--color-text-muted)]">Activity level</span>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {displayProfile.activityLevel || '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <p className="text-sm font-semibold text-[var(--color-text-muted)]">Health areas</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">Your active targets</h2>

        <div className="mt-4 space-y-3">
          {healthAreas.map(({ title, value, icon: Icon }) => (
            <div
              key={title}
              className="flex items-center justify-between rounded-[22px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-100 p-2.5 text-indigo-900 shadow-sm">
                  <Icon size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{value}</p>
                </div>
              </div>

              <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Profile