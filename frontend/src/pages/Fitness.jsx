import {
  Activity,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Sparkles,
  TimerReset,
  TrendingUp,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Fitness() {
  const { profile, todayLog } = useHealth()

  const activityLevel = profile?.activityLevel?.trim() || 'Moderate'
  const goal = profile?.goal?.trim() || 'Improve daily wellness'
  const sleepHours = Number(todayLog?.sleepHours || 0)
  const waterCount = Number(todayLog?.water || 0)
  const waterTarget = Math.max(1, Number(profile?.waterTarget || 8))
  const sleepTarget = Math.max(1, Number(profile?.sleepTarget || 7.5))

  const movementScore =
    activityLevel === 'Active'
      ? 90
      : activityLevel === 'Moderate'
        ? 72
        : activityLevel === 'Light'
          ? 52
          : 30

  const recoveryScore =
    sleepHours >= sleepTarget ? 88 : sleepHours >= sleepTarget - 1 ? 68 : 46

  const hydrationSupport =
    waterCount >= waterTarget ? 'On track' : `${waterTarget - waterCount} glass${waterTarget - waterCount > 1 ? 'es' : ''} left`

  const fitnessTip =
    movementScore >= 80
      ? 'Your activity base is strong. Focus on consistency, form, and recovery balance.'
      : movementScore >= 60
        ? 'You have a solid base. Add more structured movement during the week for better gains.'
        : movementScore >= 40
          ? 'Your activity level can improve with short and repeatable routines.'
          : 'Start with simple daily movement goals and build gradually.'

  const weeklyPlan =
    movementScore >= 80
      ? [
          'Keep 3 to 4 purposeful training sessions each week.',
          'Add one lighter recovery day with mobility or stretching.',
          'Protect sleep and hydration to support performance.',
        ]
      : movementScore >= 60
        ? [
            'Add 20 to 30 minutes of brisk walking on most days.',
            'Include 2 short strength sessions each week.',
            'Use reminders to stay consistent with movement blocks.',
          ]
        : [
            'Start with 10 to 15 minutes of walking every day.',
            'Add light stretching in the morning or evening.',
            'Choose easy routines you can repeat without skipping.',
          ]

  const activityFocus =
    goal.toLowerCase().includes('weight')
      ? 'Fat-loss support'
      : goal.toLowerCase().includes('muscle')
        ? 'Strength support'
        : goal.toLowerCase().includes('fit')
          ? 'Conditioning support'
          : 'General wellness support'

  return (
    <section className="space-y-5 pt-2">
      <div className="rounded-[30px] bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Fitness
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">
              Movement and recovery coaching
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Your current activity level is {activityLevel}. Your fitness guidance is aligned with
              your goal: {goal}.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-md">
            <Dumbbell size={22} className="text-white" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              Movement score
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">{movementScore}%</h2>
            <div className="mt-3 h-2.5 rounded-full bg-white/20">
              <div
                className="h-2.5 rounded-full bg-white transition-all duration-300"
                style={{ width: `${movementScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              Recovery score
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">{recoveryScore}%</h2>
            <div className="mt-3 h-2.5 rounded-full bg-white/20">
              <div
                className="h-2.5 rounded-full bg-white transition-all duration-300"
                style={{ width: `${recoveryScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Activity level</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-900 shadow-sm">
              <Activity size={16} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">{activityLevel}</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Current profile setting</p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Training focus</p>
            <div className="rounded-2xl border border-orange-200 bg-orange-100 p-2.5 text-orange-900 shadow-sm">
              <Flame size={16} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">{activityFocus}</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Based on your goal</p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Sleep support</p>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-100 p-2.5 text-indigo-900 shadow-sm">
              <HeartPulse size={16} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">{sleepHours.toFixed(1)}h</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Target {sleepTarget}h for better recovery
          </p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Hydration support
            </p>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-2.5 text-cyan-900 shadow-sm">
              <TrendingUp size={16} />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--color-text)]">{hydrationSupport}</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Water helps training and recovery
          </p>
        </div>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Fitness guidance</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">What to do next</h2>
          </div>

          <div className="rounded-2xl border border-lime-200 bg-lime-100 p-2.5 text-lime-900 shadow-sm">
            <Sparkles size={17} />
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">{fitnessTip}</p>
        </div>

        <div className="mt-4 grid gap-3">
          {weeklyPlan.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4"
            >
              <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2 text-emerald-900 shadow-sm">
                {index === 0 ? (
                  <Footprints size={16} />
                ) : index === 1 ? (
                  <TimerReset size={16} />
                ) : (
                  <Dumbbell size={16} />
                )}
              </div>
              <p className="text-sm leading-6 text-[var(--color-text)]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Fitness