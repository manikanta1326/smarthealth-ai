import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useHealth } from '../hooks/useHealth'

function Onboarding() {
  const navigate = useNavigate()
  const { updateProfile } = useHealth()

  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    waterTarget: '8',
    sleepTarget: '7.5',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleContinue = () => {
    updateProfile(formData)
    navigate('/dashboard')
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center">
        <div className="rounded-[32px] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-lg)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <Sparkles size={24} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            SmartHealth AI
          </p>
          <h1 className="mt-2 text-3xl font-bold">Build your personalized wellness setup</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            Start with a few details so the app can personalize hydration, sleep, and routine
            recommendations for you.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                Your name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                Primary goal
              </label>
              <input
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Example: Improve daily wellness"
                className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Water target
                </label>
                <input
                  name="waterTarget"
                  value={formData.waterTarget}
                  onChange={handleChange}
                  className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-muted)]">
                  Sleep target
                </label>
                <input
                  name="sleepTarget"
                  value={formData.sleepTarget}
                  onChange={handleChange}
                  className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Continue to app
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Onboarding