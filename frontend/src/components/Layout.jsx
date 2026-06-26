import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Bell,
  Droplets,
  Dumbbell,
  Home,
  Menu,
  MessageCircle,
  Moon,
  Salad,
  Stethoscope,
  User,
  X,
} from 'lucide-react'

const primaryNavItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/hydration', label: 'Water', icon: Droplets },
  { to: '/sleep', label: 'Sleep', icon: Moon },
  { to: '/nutrition', label: 'Food', icon: Salad },
]

const moreNavItems = [
  { to: '/fitness', label: 'Fitness', icon: Dumbbell },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/chatbot', label: 'Chatbot', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/bmi', label: 'BMI', icon: Activity },
  { to: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { to: '/reminders', label: 'Reminders', icon: Bell },
]

function Layout() {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const location = useLocation()
  const moreButtonRef = useRef(null)
  const morePanelRef = useRef(null)

  const isMoreRoute = useMemo(
    () => moreNavItems.some((item) => item.to === location.pathname),
    [location.pathname]
  )

  useEffect(() => {
    setIsMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMoreOpen) return

    const firstFocusable = morePanelRef.current?.querySelector(
      'a,button,[tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }, [isMoreOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMoreOpen(false)
    }

    if (isMoreOpen) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMoreOpen])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-100 shadow-lg lg:max-w-[430px]">
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 pb-28 pt-4">
          <Outlet />
        </main>

        {isMoreOpen && (
          <>
            <button
              type="button"
              aria-label="Close more menu"
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/30"
            />

            <div
              id="more-menu"
              ref={morePanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="more-menu-title"
              className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-[28px] border border-black/10 bg-white p-4 shadow-xl lg:max-w-[430px]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">More</p>
                  <h2 id="more-menu-title" className="mt-1 text-lg font-bold text-slate-900">
                    More sections
                  </h2>
                </div>

                <button
                  ref={moreButtonRef}
                  type="button"
                  aria-label="Close more menu"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white text-slate-900 shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {moreNavItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex min-h-[88px] flex-col items-start justify-between rounded-[22px] border p-4 text-left shadow-sm transition-all duration-200 ${
                        isActive
                          ? 'border-cyan-200 bg-cyan-50'
                          : 'border-black/5 bg-slate-50 hover:bg-white'
                      }`
                    }
                    onClick={() => setIsMoreOpen(false)}
                  >
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-2.5 text-cyan-900 shadow-sm">
                      <Icon size={18} className="text-cyan-900" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}

        <nav
          aria-label="Primary"
          className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-black/10 bg-white px-2 py-3 lg:max-w-[430px]"
        >
          <div className="grid grid-cols-5 gap-1">
            {primaryNavItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition-all ${
                    isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-500'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}

            <button
              ref={moreButtonRef}
              type="button"
              aria-label="Open more menu"
              aria-expanded={isMoreOpen}
              aria-controls="more-menu"
              onClick={() => setIsMoreOpen((current) => !current)}
              className={`flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition-all ${
                isMoreOpen || isMoreRoute ? 'bg-cyan-50 text-cyan-700' : 'text-slate-500'
              }`}
            >
              <Menu size={18} />
              <span>More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Layout