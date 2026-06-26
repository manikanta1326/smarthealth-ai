const path = require('path')
const { readJsonFile, writeJsonFile } = require('../utils/fileStore')

const todayLogFilePath = path.join(__dirname, '../data/today-log.json')

const defaultTodayLog = {
  water: 0,
  sleepHours: 0,
  mood: '',
  steps: 0,
  notes: '',
}

const getTodayLog = (req, res) => {
  const data = readJsonFile(todayLogFilePath, defaultTodayLog)

  res.json({
    success: true,
    data,
  })
}

const updateTodayLog = (req, res) => {
  const currentLog = readJsonFile(todayLogFilePath, defaultTodayLog)

  const updatedLog = {
    ...currentLog,
    ...req.body,
  }

  writeJsonFile(todayLogFilePath, updatedLog)

  res.json({
    success: true,
    message: 'Today log updated successfully',
    data: updatedLog,
  })
}

module.exports = {
  getTodayLog,
  updateTodayLog,
}