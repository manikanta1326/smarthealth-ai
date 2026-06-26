import { useEffect, useState } from 'react'
import {
  Apple,
  BadgePlus,
  Coffee,
  MoonStar,
  RotateCcw,
  Salad,
  Sparkles,
  SunMedium,
  Utensils,
} from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Nutrition() {
  const { profile } = useHealth()

  const totalMeals = 3
  const [completedMeals, setCompletedMeals] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  const goal = profile?.goal || 'Improve daily wellness'
  const mealScore = Math.min(100, Math.round((completedMeals / totalMeals) * 100))
  const remainingMeals = Math.max(0, totalMeals - completedMeals)

  useEffect(() => {
    if (!statusMessage) return

    const timeout = setTimeout(() => {
      setStatusMessage('')
    }, 2200)

    return () => clearTimeout(timeout)
  }, [statusMessage])

  const addHealthyMeal = () => {
    if (completedMeals >= totalMeals) {
      setStatusMessage('All healthy meals are already completed for today.')
      return
    }

    const nextMeals = completedMeals + 1
    setCompletedMeals(nextMeals)

    if (nextMeals === totalMeals) {
      setStatusMessage('Great job. You completed all healthy meals and reached 100%.')
    } else {
      setStatusMessage('Healthy meal added to your nutrition tracker.')
    }
  }

  const resetMeals = () => {
    setCompletedMeals(0)
    setStatusMessage('Meal progress reset for a fresh start.')
  }

  const nutritionTip =
    mealScore === 100
      ? 'Excellent work today. Your morning, afternoon, and evening meals are all completed.'
      : mealScore >= 67
        ? 'You are doing well. Finish the remaining meal to complete your day strongly.'
        : mealScore >= 34
          ? 'Good start. Keep your next meals balanced with protein, fiber, and hydration.'
          : 'Start with one healthy meal and build momentum through the day.'

  const progressMessage =
    mealScore === 100
      ? 'You completed all healthy meals for today.'
      : `You have ${remainingMeals} healthy meal${remainingMeals !== 1 ? 's' : ''} left to complete today.`

  const mealSections = [
    {
      id: 'morning',
      title: 'Morning',
      subtitle: 'Start clean and energised',
      icon: Coffee,
      iconWrap: 'border-amber-200 bg-amber-100 text-amber-900',
      meals: [
        'Warm water or lemon water after waking up',
        'Eggs, oats, idli, or poha with a fruit-based side',
        'Avoid heavy fried breakfast in the morning',
      ],
      badge: completedMeals >= 1 ? 'Completed' : 'Pending',
      done: completedMeals >= 1,
    },
    {
      id: 'afternoon',
      title: 'Afternoon',
      subtitle: 'Main fuel and protein focus',
      icon: SunMedium,
      iconWrap: 'border-orange-200 bg-orange-100 text-orange-900',
      meals: [
        'Rice or roti with dal, vegetables, and lean protein',
        'Add curd, salad, or fiber-rich sides for balance',
        'Keep lunch satisfying to reduce junk cravings later',
      ],
      badge: completedMeals >= 2 ? 'Completed' : 'Pending',
      done: completedMeals >= 2,
    },
    {
      id: 'evening',
      title: 'Evening',
      subtitle: 'Light meals for better recovery',
      icon: MoonStar,
      iconWrap: 'border-indigo-200 bg-indigo-100 text-indigo-900',
      meals: [
        'Soup, grilled paneer, khichdi, or light home-cooked dinner',
        'Reduce processed snacks, sugary drinks, and overeating',
        'Prefer early dinner and easy-to-digest foods',
      ],
      badge: completedMeals >= 3 ? 'Completed' : 'Pending',
      done: completedMeals >= 3,
    },
  ]

  return (
    <section className="space-y-5 pt-2">
      <div className="overflow-hidden rounded-[30px] border border-orange-200/70 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-5 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Nutrition tracker
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight">
              {mealScore}% meal quality score
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/90">
              Your food guidance is organised into morning, afternoon, and evening meals for your
              goal: {goal}.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-md">
            <Salad size={22} className="text-white" />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/85">
            <span>Meal progress</span>
            <span>{mealScore}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/20">
            <div
              className="h-3 rounded-full bg-white transition-all duration-300"
              style={{ width: `${mealScore}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/90">{progressMessage}</p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={addHealthyMeal}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98]"
          >
            <BadgePlus size={16} className="text-white" />
            Add healthy meal
          </button>

          <button
            type="button"
            onClick={resetMeals}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/25 active:scale-95"
            aria-label="Reset meal progress"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800 shadow-[var(--shadow-sm)]">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Meal score</p>
            <div className="rounded-2xl border border-orange-200 bg-orange-100 p-2.5 text-orange-900 shadow-sm">
              <Utensils size={16} className="text-orange-900" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[var(--color-text)]">{mealScore}%</h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Based on completed healthy meals
          </p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Progress</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-900 shadow-sm">
              <Apple size={16} className="text-emerald-900" />
            </div>
          </div>

          <h2 className="mt-4 text-lg font-bold leading-6 text-[var(--color-text)]">
            {completedMeals} / {totalMeals} meals
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Healthy meals completed</p>
        </div>
      </div>

      <div className="rounded-[30px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Nutrition insight
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
              Daily meal flow
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--color-accent-light)] bg-[var(--color-accent-light)] p-2.5 text-[var(--color-accent)] shadow-sm">
            <Sparkles size={17} />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">{nutritionTip}</p>

        <div className="mt-5 space-y-4">
          {mealSections.map(({ id, title, subtitle, icon: Icon, meals, badge, done, iconWrap }) => (
            <div
              key={id}
              className={`rounded-[24px] border p-4 shadow-sm ${
                done
                  ? 'border-emerald-200 bg-emerald-50/70'
                  : 'border-black/5 bg-[var(--color-surface-2)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-2xl border p-2.5 shadow-sm ${iconWrap}`}>
                    <Icon size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          done ? 'bg-emerald-600 text-white' : 'bg-black text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {meals.map((meal) => (
                  <div
                    key={meal}
                    className="rounded-[18px] border border-black/5 bg-white px-4 py-3"
                  >
                    <p className="text-sm leading-6 text-[var(--color-text)]">{meal}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Nutrition