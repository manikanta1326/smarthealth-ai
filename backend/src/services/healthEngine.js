const calculateBMI = (heightCm, weightKg) => {
  const height = Number(heightCm)
  const weight = Number(weightKg)

  if (!height || !weight) {
    return {
      bmi: 0,
      category: 'Unknown',
    }
  }

  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  let category = 'Normal'

  if (bmi < 18.5) {
    category = 'Underweight'
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight'
  } else if (bmi >= 30) {
    category = 'Obese'
  }

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
  }
}

const calculateHealthScore = (profile, todayLog) => {
  let score = 100
  const waterTarget = Number(profile.waterTarget) || 8
  const sleepTarget = Number(profile.sleepTarget) || 8
  const water = Number(todayLog.water) || 0
  const sleepHours = Number(todayLog.sleepHours) || 0
  const steps = Number(todayLog.steps) || 0

  if (water < waterTarget) {
    score -= Math.min(20, (waterTarget - water) * 2)
  }

  if (sleepHours < sleepTarget) {
    score -= Math.min(20, (sleepTarget - sleepHours) * 3)
  }

  if (steps < 4000) {
    score -= 15
  } else if (steps < 7000) {
    score -= 8
  }

  const { bmi, category } = calculateBMI(profile.height, profile.weight)

  if (category === 'Underweight' || category === 'Overweight') {
    score -= 8
  }

  if (category === 'Obese') {
    score -= 15
  }

  return {
    score: Math.max(0, Math.round(score)),
    bmi,
    bmiCategory: category,
  }
}

const generateRecommendations = (profile, todayLog) => {
  const recommendations = []
  const waterTarget = Number(profile.waterTarget) || 8
  const sleepTarget = Number(profile.sleepTarget) || 8
  const water = Number(todayLog.water) || 0
  const sleepHours = Number(todayLog.sleepHours) || 0
  const steps = Number(todayLog.steps) || 0
  const { bmi, category } = calculateBMI(profile.height, profile.weight)

  if (water < waterTarget) {
    recommendations.push({
      type: 'hydration',
      title: 'Increase hydration',
      message: `You are ${waterTarget - water} glass${waterTarget - water !== 1 ? 'es' : ''} below your water target today.`,
    })
  }

  if (sleepHours < sleepTarget) {
    recommendations.push({
      type: 'sleep',
      title: 'Improve sleep duration',
      message: `You are ${(sleepTarget - sleepHours).toFixed(1)} hour${sleepTarget - sleepHours !== 1 ? 's' : ''} below your sleep target.`,
    })
  }

  if (steps < 6000) {
    recommendations.push({
      type: 'activity',
      title: 'Move more today',
      message: 'A 20 to 30 minute walk can improve activity balance and overall wellness.',
    })
  }

  if (category === 'Underweight') {
    recommendations.push({
      type: 'weight',
      title: 'Support healthy weight gain',
      message: `Your BMI is ${bmi}. Consider nutrient-dense meals, strength training, and regular meal timing.`,
    })
  }

  if (category === 'Overweight' || category === 'Obese') {
    recommendations.push({
      type: 'weight',
      title: 'Support healthy weight balance',
      message: `Your BMI is ${bmi}. Focus on balanced meals, daily movement, and consistent sleep routines.`,
    })
  }

  if (!recommendations.length) {
    recommendations.push({
      type: 'general',
      title: 'You are doing well',
      message: 'Your hydration, sleep, and activity pattern look balanced today. Keep the routine going.',
    })
  }

  return recommendations
}

const generateNutritionTips = (profile) => {
  const goal = String(profile.goal || '').toLowerCase()
  const tips = []

  if (goal.includes('weight') || goal.includes('gain')) {
    tips.push('Add protein-rich snacks like eggs, yogurt, nuts, or peanut butter.')
    tips.push('Choose calorie-dense but nutritious foods such as bananas, oats, milk, and paneer.')
  }

  if (goal.includes('lose') || goal.includes('fat')) {
    tips.push('Prefer high-fiber foods and lean protein to stay full for longer.')
    tips.push('Reduce sugary drinks and heavily processed snacks.')
  }

  if (goal.includes('wellness') || goal.includes('healthy')) {
    tips.push('Build each meal with protein, vegetables, complex carbs, and water.')
    tips.push('Keep meal timing regular and avoid skipping breakfast often.')
  }

  if (!tips.length) {
    tips.push('Try to include protein, fiber, and water in each major meal.')
    tips.push('Choose home-cooked meals more often than ultra-processed foods.')
  }

  return tips
}

const analyzeSymptoms = (symptoms = []) => {
  const normalized = symptoms.map((item) => String(item).toLowerCase())

  if (normalized.includes('fever') && normalized.includes('cough')) {
    return {
      condition: 'Flu or viral infection',
      severity: 'medium',
      advice: 'Rest well, stay hydrated, monitor temperature, and consider medical review if symptoms worsen.',
    }
  }

  if (normalized.includes('headache') && normalized.includes('dehydration')) {
    return {
      condition: 'Possible dehydration-related discomfort',
      severity: 'low',
      advice: 'Increase fluids, rest, and monitor for persistence.',
    }
  }

  if (normalized.includes('chest pain') || normalized.includes('shortness of breath')) {
    return {
      condition: 'Urgent symptoms detected',
      severity: 'high',
      advice: 'Seek immediate medical attention or emergency care.',
    }
  }

  return {
    condition: 'General wellness concern',
    severity: 'low',
    advice: 'Track symptoms, rest, hydrate, and consult a doctor if symptoms continue.',
  }
}

const generateChatbotReply = (message, profile, todayLog) => {
  const input = String(message || '').toLowerCase()
  const { score, bmi, bmiCategory } = calculateHealthScore(profile, todayLog)

  if (input.includes('bmi')) {
    return `Your current BMI is ${bmi} and it falls in the ${bmiCategory} category.`
  }

  if (input.includes('water') || input.includes('hydration')) {
    return `You have logged ${todayLog.water || 0} glasses of water today. Try to stay close to your daily target of ${profile.waterTarget || 8} glasses.`
  }

  if (input.includes('sleep')) {
    return `You have logged ${todayLog.sleepHours || 0} hours of sleep today. Your target is ${profile.sleepTarget || 8} hours.`
  }

  if (input.includes('score') || input.includes('health')) {
    return `Your current health score is ${score}/100 based on hydration, sleep, activity, and BMI signals.`
  }

  return 'I can help with BMI, hydration, sleep, health score, and daily wellness suggestions.'
}

module.exports = {
  calculateBMI,
  calculateHealthScore,
  generateRecommendations,
  generateNutritionTips,
  analyzeSymptoms,
  generateChatbotReply,
}