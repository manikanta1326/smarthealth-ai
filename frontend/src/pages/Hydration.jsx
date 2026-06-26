import { useEffect, useState } from 'react'
import {
  BellRing,
  CheckCircle2,
  Droplets,
  GlassWater,
  Minus,
  Plus,
  TimerReset,
  XCircle,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Hydration() {
  const { todayLog, updateTodayLog, profile } = useHealth()

  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const waterCount = Number(todayLog?.water || 0)
  const waterTarget = Math.max(1, Number(profile?.waterTarget || 8))
  const progress = Math.min(100, Math.round((waterCount / waterTarget) * 100))
  const remainingGlasses = Math.max(0, waterTarget - waterCount)

  const scheduleTimes = [
    '7:00 AM',
    '9:00 AM',
    '11:00 AM',
    '1:00 PM',
    '3:00 PM',
    '5:00 PM',
    '7:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
    '11:30 PM',
    '11:50 PM',
  ]

  const timeline = Array.from({ length: waterTarget }, (_, index) => {
    let status = 'Upcoming'

    if (index < waterCount) {
      status = 'Completed'
    } else if (index === waterCount && waterCount < waterTarget) {
      status = 'Current'
    }

    return {
      id: index + 1,
      time: scheduleTimes[index] || `${7 + index}:00`,
      amount: '1 glass',
      status,
    }
  })

  useEffect(() => {
    if (!statusMessage) return

    const timeout = setTimeout(() => {
      setStatusMessage('')
      setStatusType('')
    }, 2200)

    return () => clearTimeout(timeout)
  }, [statusMessage])

  const showStatus = (message, type) => {
    setStatusMessage(message)
    setStatusType(type)
  }

  const addWater = async () => {
    if (waterCount >= waterTarget) {
      showStatus('Daily target already reached.', 'error')
      return
    }

    setIsSaving(true)

    const result = await updateTodayLog({ water: waterCount + 1 })

    if (result?.success) {
      showStatus('Water intake updated inside your daily tracker.', 'success')
    } else {
      showStatus('Could not update water intake.', 'error')
    }

    setIsSaving(false)
  }

  const removeWater = async () => {
    if (waterCount <= 0) {
      showStatus('Water count is already zero.', 'error')
      return
    }

    setIsSaving(true)

    const result = await updateTodayLog({ water: waterCount - 1 })

    if (result?.success) {
      showStatus('Water intake reduced from your daily tracker.', 'success')
    } else {
      showStatus('Could not reduce water intake.', 'error')
    }

    setIsSaving(false)
  }

  const hydrationMessage =
    progress === 100
      ? 'Excellent. You completed your hydration target for today.'
      : `You need ${remainingGlasses} more glass${
          remainingGlasses !== 1 ? 'es' : ''
        } to reach today’s target.`

  return (
    <section className="space-y-5 pt-2">
      <div className="rounded-[30px] border border-white/20 bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Hydration tracker
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">
              {waterCount} of {waterTarget} glasses completed today
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/85">{hydrationMessage}</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-md">
            <Droplets size={22} className="text-white" />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/85">
            <span>Daily progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/20">
            <div
              className="h-3 rounded-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={removeWater}
            disabled={isSaving}
            aria-label="Remove one glass"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={addWater}
            disabled={isSaving}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} className="text-white" />
            {isSaving ? 'Saving...' : 'Add Glass'}
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div
          className={`flex items-start gap-3 rounded-[22px] border px-4 py-3 text-sm font-medium shadow-[var(--shadow-sm)] ${
            statusType === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {statusType === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </div>
          <p>{statusMessage}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Daily target</p>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-2.5 text-cyan-900 shadow-sm">
              <GlassWater size={16} className="text-cyan-900" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[var(--color-text)]">{waterTarget}</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Glasses per day</p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Progress</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-900 shadow-sm">
              <BellRing size={16} className="text-emerald-900" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[var(--color-text)]">{progress}%</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Daily completion</p>
        </div>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Auto-generated plan
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
              Hydration timeline
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--color-accent-light)]/50 bg-[var(--color-accent-light)] p-2.5 text-[var(--color-accent)] shadow-sm">
            <TimerReset size={17} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {timeline.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-[20px] border px-4 py-4 ${
                item.status === 'Completed'
                  ? 'border-emerald-100 bg-emerald-50/70'
                  : item.status === 'Current'
                    ? 'border-cyan-100 bg-cyan-50/70'
                    : 'border-black/5 bg-[var(--color-surface-2)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{item.time}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.amount}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === 'Completed'
                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                    : item.status === 'Current'
                      ? 'border border-cyan-200 bg-cyan-100 text-cyan-800'
                      : 'border border-amber-200 bg-amber-100 text-amber-800'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hydration