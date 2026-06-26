const express = require('express')

const router = express.Router()

let todayLog = {
  water: 0,
  sleepHours: 0,
  mood: '',
  steps: 0,
  notes: '',
}

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: todayLog,
  })
})

router.put('/', (req, res) => {
  todayLog = {
    ...todayLog,
    ...req.body,
  }

  res.json({
    success: true,
    message: 'Daily log updated successfully',
    data: todayLog,
  })
})

module.exports = router