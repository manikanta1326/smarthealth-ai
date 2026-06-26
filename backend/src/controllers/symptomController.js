const { analyzeSymptoms } = require('../services/healthEngine')

const checkSymptoms = (req, res) => {
  const { symptoms = [] } = req.body
  const analysis = analyzeSymptoms(symptoms)

  res.json({
    success: true,
    data: analysis,
  })
}

module.exports = {
  checkSymptoms,
}