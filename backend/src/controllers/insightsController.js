const path = require('path')
const { readJsonFile } = require('../utils/fileStore')
const {
  calculateHealthScore,
  generateRecommendations,
  generateNutritionTips,
} = require('../services/healthEngine')

const profileFilePath = path.join(__dirname, '../data/profile.json')
const todayLogFilePath = path.join(__dirname, '../data/today-log.json')

const defaultProfile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  goal: '',
  waterTarget: '',
  sleepTarget: '',
  activityLevel: '',
  photo: '',
}

const defaultTodayLog = {
  water: 0,
  sleepHours: 0,
  mood: '',
  steps: 0,
  notes: '',
}

const getInsights = (req, res) => {
  const profile = readJsonFile(profileFilePath, defaultProfile)
  const todayLog = readJsonFile(todayLogFilePath, defaultTodayLog)

  const summary = calculateHealthScore(profile, todayLog)
  const recommendations = generateRecommendations(profile, todayLog)
  const nutritionTips = generateNutritionTips(profile)

  res.json({
    success: true,
    data: {
      summary,
      recommendations,
      nutritionTips,
      profile,
      todayLog,
    },
  })
}

module.exports = {
  getInsights,
}