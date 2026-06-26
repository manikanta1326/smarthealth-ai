import { useContext, useState } from 'react'
import HealthContext from '../context/HealthContext'

function Bmi() {
  const { bmiData, profile, updateBmiData } = useContext(HealthContext)
  const [height, setHeight] = useState(bmiData.height || profile.height || '')
  const [weight, setWeight] = useState(bmiData.weight || profile.weight || '')

  const handleCalculate = () => {
    updateBmiData({ height, weight })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cyan-600">Health tools</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">BMI Calculator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Calculate your body mass index using your height and weight.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Height (cm)</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Weight (kg)</span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </label>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          Calculate BMI
        </button>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        {bmiData.bmi ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Your BMI</p>
            <h2 className="text-4xl font-bold text-slate-900">{bmiData.bmi}</h2>
            <div className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              {bmiData.category}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Enter your height and weight to calculate BMI.</p>
        )}
      </div>
    </div>
  )
}

export default Bmi