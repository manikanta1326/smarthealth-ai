import { useEffect, useState } from 'react'
import {
  BedDouble,
  CheckCircle2,
  Minus,
  Moon,
  Plus,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Sleep() {
  const { todayLog, updateTodayLog, profile } = useHealth()

  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const sleepHours = Number(todayLog?.sleepHours || 0)
  const sleepTarget = Math.max(1, Number(profile?.sleepTarget || 7.5))
  const sleepPercent = Math.min(100, Math.round((sleepHours / sleepTarget) * 100))

  const formattedSleepHours = Number(sleepHours).toFixed(1)
  const formattedSleepTarget = Number(sleepTarget).toFixed(1)

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

  const addSleep = async () => {
    const nextValue = Number((sleepHours + 0.5).toFixed(1))
    setIsSaving(true)

    const result = await updateTodayLog({ sleepHours: nextValue })

    if (result?.success) {
      showStatus('Sleep hours updated inside your recovery tracker.', 'success')
    } else {
      showStatus('Could not update sleep hours.', 'error')
    }

    setIsSaving(false)
  }

  const reduceSleep = async () => {
    if (sleepHours <= 0) {
      showStatus('Sleep hours are already at zero.', 'error')
      return
    }

    const nextValue = Number(Math.max(0, sleepHours - 0.5).toFixed(1))
    setIsSaving(true)

    const result = await updateTodayLog({ sleepHours: nextValue })

    if (result?.success) {
      showStatus('Sleep hours reduced inside your recovery tracker.', 'success')
    } else {
      showStatus('Could not reduce sleep hours.', 'error')
    }

    setIsSaving(false)
  }

  const remainingSleep = Math.max(0, Number((sleepTarget - sleepHours).toFixed(1)))

  const sleepAdvice =
    sleepHours >= sleepTarget
      ? 'You are meeting your recovery target today.'
      : `You still need ${remainingSleep.toFixed(1)} more hour${
          remainingSleep.toFixed(1) !== '1.0' ? 's' : ''
        } to reach your target.`

  const recoveryNote =
    sleepPercent === 100
      ? 'Excellent recovery today. Keep the same bedtime rhythm tonight.'
      : sleepPercent >= 75
        ? 'You are close to your target. A strong bedtime routine can complete the day well.'
        : sleepPercent >= 40
          ? 'Recovery is in progress. Try to reduce late-night screen time and sleep on schedule.'
          : 'Start building sleep consistency with an earlier bedtime and calm wind-down routine.'

  return (
    <section className="space-y-5 pt-2">
      <div className="rounded-[30px] border border-white/20 bg-indigo-600 p-5 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Sleep tracker
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight">
              {formattedSleepHours} of {formattedSleepTarget} hours completed
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/85">{sleepAdvice}</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-md">
            <Moon size={22} className="text-white" />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/85">
            <span>Recovery progress</span>
            <span>{sleepPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/20">
            <div
              className="h-3 rounded-full bg-white transition-all duration-300"
              style={{ width: `${sleepPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={reduceSleep}
            disabled={isSaving}
            aria-label="Reduce sleep by 0.5 hour"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={addSleep}
            disabled={isSaving}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} className="text-white" />
            {isSaving ? 'Saving...' : 'Add 0.5 hour'}
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div
          className={`flex items-start gap-3 rounded-[22px] border px-4 py-3 text-sm font-medium shadow-[var(--shadow-sm)] ${
            statusType === 'success'
              ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
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
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Sleep target</p>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-100 p-2.5 text-indigo-900 shadow-sm">
              <BedDouble size={16} className="text-indigo-900" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[var(--color-text)]">
            {formattedSleepTarget}
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Hours per night</p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Recovery</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-900 shadow-sm">
              <Sparkles size={16} className="text-emerald-900" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[var(--color-text)]">{sleepPercent}%</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Target completion</p>
        </div>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Recovery insight
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
              Sleep guidance
            </h2>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-100 p-2.5 text-indigo-900 shadow-sm">
            <Moon size={17} className="text-indigo-900" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--color-text)]">Today’s recovery note</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{recoveryNote}</p>
          </div>

          <div className="rounded-[20px] border border-black/5 bg-[var(--color-surface-2)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--color-text)]">Suggested routine</p>
            <div className="mt-2 space-y-2">
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Keep lights dim 30 to 60 minutes before sleep.
              </p>
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Avoid heavy meals and long screen time near bedtime.
              </p>
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                Try a consistent sleep and wake schedule every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sleep