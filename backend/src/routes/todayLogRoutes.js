const express = require('express')
const { getTodayLog, updateTodayLog } = require('../controllers/todayLogController')

const router = express.Router()

router.get('/', getTodayLog)
router.put('/', updateTodayLog)

module.exports = router