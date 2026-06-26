const express = require('express')
const { getNutrition, updateNutrition } = require('../controllers/nutritionController')

const router = express.Router()

router.get('/', getNutrition)
router.put('/', updateNutrition)

module.exports = router