import { useContext, useMemo, useState } from 'react'
import HealthContext from '../context/HealthContext'

const symptomOptions = [
  'Headache',
  'Fever',
  'Cough',
  'Sore throat',
  'Stomach pain',
  'Fatigue',
  'Dizziness',
  'Body pain',
]

function getGuidance(symptom, severity) {
  if (!symptom) {
    return {
      tone: 'bg-slate-50 text-slate-700',
      title: 'No symptom selected',
      message: 'Choose a symptom and severity to get general wellness guidance.',
    }
  }

  if (severity === 'Severe') {
    return {
      tone: 'bg-rose-50 text-rose-700',
      title: 'Seek medical care soon',
      message:
        'Severe symptoms should be reviewed promptly by a healthcare professional, especially if they worsen or feel unusual.',
    }
  }

  if (symptom === 'Fever' || symptom === 'Cough') {
    return {
      tone: 'bg-amber-50 text-amber-700',
      title: 'Monitor and rest',
      message:
        'Rest, hydrate well, track your symptoms, and consider medical advice if they continue for several days.',
    }
  }

  return {
    tone: 'bg-cyan-50 text-cyan-700',
    title: 'Track and observe',
    message:
      'Log the symptom, note triggers or duration, rest well, and seek professional advice if it persists or gets worse.',
  }
}

function Symptoms() {
  const { symptomEntries, saveSymptomEntry, clearSymptoms } = useContext(HealthContext)
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('Mild')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')

  const guidance = useMemo(() => getGuidance(symptom, severity), [symptom, severity])

  const handleSave = () => {
    saveSymptomEntry({ symptom, severity, duration, notes })

    if (symptom.trim()) {
      setSymptom('')
      setSeverity('Mild')
      setDuration('')
      setNotes('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cyan-600">Health tools</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Symptom Checker</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track symptoms and get simple wellness guidance.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Symptom</span>
            <select
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
            >
              <option value="">Select a symptom</option>
              {symptomOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Severity</span>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
            >
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Duration</span>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2 days"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe when it started or what makes it worse..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </label>

          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Save symptom
          </button>
        </div>
      </div>

      <div className={`rounded-3xl p-5 shadow-sm ${guidance.tone}`}>
        <p className="text-sm font-semibold">{guidance.title}</p>
        <p className="mt-2 text-sm leading-6">{guidance.message}</p>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
        <p className="text-sm font-semibold text-rose-700">Important note</p>
        <p className="mt-2 text-sm leading-6 text-rose-700">
          This page gives general health information only. It is not a diagnosis, not medical advice,
          and not an emergency service. Seek urgent medical help for chest pain, trouble breathing,
          stroke signs, severe bleeding, loss of consciousness, or self-harm thoughts.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Symptom log</h2>
            <p className="text-sm text-slate-500">Recent saved symptoms</p>
          </div>

          {symptomEntries.length > 0 && (
            <button
              type="button"
              onClick={clearSymptoms}
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-3">
          {symptomEntries.length > 0 ? (
            symptomEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{entry.symptom}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {entry.severity} • {entry.duration || 'No duration added'}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      entry.severity === 'Severe'
                        ? 'bg-rose-100 text-rose-700'
                        : entry.severity === 'Moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {entry.severity}
                  </span>
                </div>

                {entry.notes && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{entry.notes}</p>
                )}

                <p className="mt-3 text-xs text-slate-400">{entry.date}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              No symptoms logged yet. Add one above to start tracking patterns.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Symptoms