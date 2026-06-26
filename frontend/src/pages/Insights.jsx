import {
  Activity,
  Bell,
  Droplets,
  Moon,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Insights() {
  const { profile, todayLog, bmiData, reminders, symptomEntries } = useHealth()

  const waterCount = Number(todayLog?.water || 0)
  const waterTarget = Math.max(1, Number(profile?.waterTarget || 8))
  const sleepHours = Number(todayLog?.sleepHours || 0)
  const sleepTarget = Math.max(1, Number(profile?.sleepTarget || 7.5))

  const waterProgress = Math.min(100, Math.round((waterCount / waterTarget) * 100))
  const sleepProgress = Math.min(100, Math.round((sleepHours / sleepTarget) * 100))

  const activeReminders = reminders.filter((item) => item.active)
  const latestSymptom = symptomEntries.length > 0 ? symptomEntries[0] : null

  const cards = [
    {
      title: 'Hydration',
      value: `${waterCount}/${waterTarget}`,
      note: `${waterProgress}% of target`,
      icon: Droplets,
      tone: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    },
    {
      title: 'Sleep',
      value: `${sleepHours.toFixed(1)}h`,
      note: `${sleepProgress}% of target`,
      icon: Moon,
      tone: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      title: 'BMI',
      value: bmiData?.bmi || '--',
      note: bmiData?.category || 'Not calculated yet',
      icon: Activity,
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      title: 'Reminders',
      value: `${activeReminders.length}`,
      note: 'Active today',
      icon: Bell,
      tone: 'bg-violet-50 text-violet-700 border-violet-100',
    },
  ]

  const insights = [
    waterCount < waterTarget
      ? 'Hydration is below your target. A few more glasses today would improve your daily balance.'
      : 'Hydration target is met, which is a strong routine signal.',
    sleepHours < sleepTarget
      ? 'Sleep is under target. A more consistent bedtime may help more than catch-up sleep.'
      : 'Sleep is on target, which supports better recovery.',
    bmiData?.bmi
      ? `Your BMI is ${bmiData.bmi}, currently marked as ${bmiData.category}.`
      : 'BMI is not available yet. Add height and weight to unlock this insight.',
    latestSymptom
      ? `Latest symptom tracked: ${latestSymptom.symptom} (${latestSymptom.severity}).`
      : 'No symptom entries yet, so pattern tracking has not started.',
  ]

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-cyan-600">Health insights</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-2 text-sm text-slate-600">
          A summary of your core health data, reminders, and recent symptom tracking.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map(({ title, value, note, icon: Icon, tone }) => (
          <div key={title} className={`rounded-3xl border p-4 shadow-sm ${tone}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{title}</p>
              <Icon size={18} />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">{value}</h2>
            <p className="mt-1 text-xs text-slate-600">{note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Trend summary</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">What stands out</h2>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-2.5 text-cyan-700">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {insights.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-cyan-600" />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Recommended focus</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Next actions</h2>
          </div>
          <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-700">
            <Target size={18} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {waterCount < waterTarget && (
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-sm font-semibold text-cyan-700">Hydration</p>
              <p className="mt-1 text-sm text-cyan-700">
                Complete your water target to improve today’s score.
              </p>
            </div>
          )}

          {sleepHours < sleepTarget && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-700">Sleep</p>
              <p className="mt-1 text-sm text-indigo-700">
                Protect bedtime and reduce late-night distractions.
              </p>
            </div>
          )}

          {!bmiData?.bmi && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">BMI</p>
              <p className="mt-1 text-sm text-emerald-700">
                Add height and weight for a clearer health summary.
              </p>
            </div>
          )}

          {!latestSymptom && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700">Symptoms</p>
              <p className="mt-1 text-sm text-rose-700">
                Log symptoms early so you can spot patterns over time.
              </p>
            </div>
          )}

          {activeReminders.length === 0 && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm font-semibold text-violet-700">Reminders</p>
              <p className="mt-1 text-sm text-violet-700">
                Add reminders for water, meals, sleep, or movement.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 text-slate-500" />
          <p className="text-sm leading-6 text-slate-600">
            These insights are for wellness tracking only and do not replace medical advice.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Insights