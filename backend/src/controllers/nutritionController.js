const path = require('path')
const { readJsonFile, writeJsonFile } = require('../utils/fileStore')
const { generateNutritionTips } = require('../services/healthEngine')

const nutritionFilePath = path.join(__dirname, '../data/nutrition.json')
const profileFilePath = path.join(__dirname, '../data/profile.json')

const defaultNutrition = {
  calories: 0,
  meals: [],
}

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

const getNutrition = (req, res) => {
  const nutrition = readJsonFile(nutritionFilePath, defaultNutrition)
  const profile = readJsonFile(profileFilePath, defaultProfile)
  const tips = generateNutritionTips(profile)

  res.json({
    success: true,
    data: {
      ...nutrition,
      tips,
    },
  })
}

const updateNutrition = (req, res) => {
  const currentNutrition = readJsonFile(nutritionFilePath, defaultNutrition)

  const updatedNutrition = {
    ...currentNutrition,
    ...req.body,
  }

  writeJsonFile(nutritionFilePath, updatedNutrition)

  res.json({
    success: true,
    message: 'Nutrition data updated successfully',
    data: updatedNutrition,
  })
}

module.exports = {
  getNutrition,
  updateNutrition,
}