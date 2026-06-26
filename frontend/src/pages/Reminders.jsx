import { useContext, useState } from 'react'
import HealthContext from '../context/HealthContext'

function Reminders() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useContext(HealthContext)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('Hydration')

  const handleAddReminder = () => {
    addReminder({ title, time, type })
    setTitle('')
    setTime('')
    setType('Hydration')
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cyan-600">Health tools</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Reminders</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage health reminders for water, sleep, food, and fitness.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reminder title"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 08:00 AM"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
        >
          <option>Hydration</option>
          <option>Sleep</option>
          <option>Nutrition</option>
          <option>Fitness</option>
          <option>Medicine</option>
        </select>

        <button
          type="button"
          onClick={handleAddReminder}
          className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          Add reminder
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((item) => (
          <div key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.type} • {item.time}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleReminder(item.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.active ? 'Active' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteReminder(item.id)}
                  className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {reminders.length === 0 && (
          <div className="rounded-3xl bg-white p-5 text-sm text-slate-500 shadow-sm">
            No reminders yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  )
}

export default Reminders