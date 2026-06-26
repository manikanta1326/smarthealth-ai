import {
  Activity,
  Bell,
  Brain,
  ChevronRight,
  Droplets,
  Moon,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Utensils,
  AlertCircle,
  LogOut,
  MessageCircle, // Step 1: Imported MessageCircle Icon
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useHealth } from '../hooks/useHealth'
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    profile,
    todayLog,
    bmiData,
    reminders,
    symptomEntries,
    isLoading,
  } = useHealth()

  const displayName = user?.name || profile?.name?.trim() || 'User'
  const firstName = displayName.split(' ')[0]

  const waterCount = Number(todayLog?.water || 0)
  const waterTarget = Math.max(1, Number(profile?.waterTarget || 8))

  const sleepHours = Number(todayLog?.sleepHours || 0)
  const sleepTarget = Math.max(1, Number(profile?.sleepTarget || 7.5))

  const waterProgress = Math.min(100, Math.round((waterCount / waterTarget) * 100))
  const sleepProgress = Math.min(100, Math.round((sleepHours / sleepTarget) * 100))

  const formattedSleepHours = sleepHours.toFixed(1)
  const nutritionScore = 82

  const activeReminders = reminders.filter((item) => item.active)
  const latestSymptom = symptomEntries.length > 0 ? symptomEntries[0] : null

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const healthStats = [
    {
      title: 'Water',
      value: `${waterCount}/${waterTarget}`,
      note: `${waterProgress}% of daily target`,
      icon: Droplets,
      iconBg: 'border-cyan-200 bg-cyan-100',
      iconText: 'text-cyan-900',
      link: '/hydration',
    },
    {
      title: 'Sleep',
      value: `${formattedSleepHours}h`,
      note: `${sleepProgress}% of target`,
      icon: Moon,
      iconBg: 'border-indigo-200 bg-indigo-100',
      iconText: 'text-indigo-900',
      link: '/sleep',
    },
    {
      title: 'BMI',
      value: bmiData?.bmi || '--',
      note: bmiData?.category || 'Calculate BMI',
      icon: Activity,
      iconBg: 'border-emerald-200 bg-emerald-100',
      iconText: 'text-emerald-900',
      link: '/bmi',
    },
    {
      title: 'Goal',
      value: profile?.goal?.trim() ? 'Active' : 'Pending',
      note: profile?.goal?.trim() ? profile.goal : 'Set a health goal',
      icon: Target,
      iconBg: 'border-orange-200 bg-orange-100',
      iconText: 'text-orange-900',
      link: '/profile',
    },
  ]

  const recommendations = [
    waterCount < waterTarget
      ? `Drink ${waterTarget - waterCount} more glass${waterTarget - waterCount > 1 ? 'es' : ''} of water today.`
      : 'Hydration target completed for today.',
    sleepHours < sleepTarget
      ? `You still need ${(sleepTarget - sleepHours).toFixed(1)} more hour${
          (sleepTarget - sleepHours).toFixed(1) !== '1.0' ? 's' : ''
        } to reach your sleep target.`
      : 'Sleep target completed for today.',
    bmiData?.bmi
      ? `Your current BMI is ${bmiData.bmi} (${bmiData.category}).`
      : 'Calculate your BMI for a better health overview.',
    activeReminders.length > 0
      ? `You have ${activeReminders.length} active reminder${activeReminders.length > 1 ? 's' : ''} today.`
      : 'Add reminders to stay consistent with your routine.',
  ]

  const pulseTitle =
    waterCount < waterTarget
      ? 'Your hydration is behind target today.'
      : sleepHours < sleepTarget
        ? 'Hydration looks good, but sleep still needs attention.'
        : bmiData?.bmi
          ? 'Your core health signals are looking organized today.'
          : 'You are building a stronger daily health routine.'

  const pulseText =
    waterCount < waterTarget
      ? `Keep your water timing stronger. You still need ${waterTarget - waterCount} more glass${
          waterTarget - waterCount > 1 ? 'es' : ''
        }.`
      : sleepHours < sleepTarget
        ? `Good hydration progress so far. Focus on reaching your remaining ${(sleepTarget - sleepHours).toFixed(
            1
          )} sleep hour${(sleepTarget - sleepHours).toFixed(1) !== '1.0' ? 's' : ''}.`
        : bmiData?.bmi
          ? `BMI, hydration, and sleep are now part of your dashboard. Keep tracking consistently for better insights.`
          : 'Complete more health inputs to unlock stronger personalized guidance.'

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Loading dashboard
            </p>
            <h1 className="mt-1 text-[28px] font-bold text-[var(--color-text)]">
              Please wait...
            </h1>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-surface-2)]" />
        </div>
        <div className="rounded-[28px] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full bg-[var(--color-surface-2)]" />
            <div className="h-8 w-3/4 rounded-full bg-[var(--color-surface-2)]" />
            <div className="h-4 w-full rounded-full bg-[var(--color-surface-2)]" />
            <div className="h-4 w-5/6 rounded-full bg-[var(--color-surface-2)]" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-5 relative pb-28">
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Good evening</p>
          <h1 className="mt-1 text-[28px] font-bold text-[var(--color-text)]">{firstName}</h1>
        </div>

        <Link
          to="/profile"
          aria-label="Open profile"
          className="flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-3 text-[var(--color-text)] no-underline shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98]"
        >
          <User size={18} className="text-[var(--color-text)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {firstName.charAt(0).toUpperCase()}
          </span>
        </Link>
      </div>

      {/* AI Health Pulse */}
      <div className="rounded-[28px] bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              AI health pulse
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-white">{pulseTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/85">{pulseText}</p>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-md">
            <Brain size={20} className="text-white" />
          </div>
        </div>
        <Link
          to="/insights"
          className="mt-5 inline-flex min-h-[50px] w-[180px] items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black no-underline shadow-sm transition-all duration-200 hover:bg-neutral-100 active:scale-[0.98]"
        >
          <span className="whitespace-nowrap text-black">View AI plan</span>
          <ChevronRight size={16} className="shrink-0 text-black" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {healthStats.map(({ title, value, note, icon: Icon, iconBg, iconText, link }) => (
          <Link
            key={title}
            to={link}
            className="rounded-[24px] border border-black/5 bg-[var(--color-surface)] p-4 no-underline shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">{title}</p>
              <div className={`rounded-2xl border p-2.5 shadow-sm ${iconBg} ${iconText}`}>
                <Icon size={16} />
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-bold text-[var(--color-text)]">{value}</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{note}</p>
          </Link>
        ))}
      </div>

      {/* Reminders & Symptoms */}
      <div className="grid grid-cols-1 gap-4">
        <Link
          to="/reminders"
          className="rounded-[28px] border border-black/5 bg-[var(--color-surface)] p-5 no-underline shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">Reminders</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
                {activeReminders.length} active
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {activeReminders.length > 0
                  ? `${activeReminders[0].title} at ${activeReminders[0].time}`
                  : 'No active reminders yet'}
              </p>
            </div>
            <div className="rounded-2xl border border-violet-200 bg-violet-100 p-2.5 text-violet-900 shadow-sm">
              <Bell size={18} />
            </div>
          </div>
        </Link>

        <Link
          to="/symptoms"
          className="rounded-[28px] border border-black/5 bg-[var(--color-surface)] p-5 no-underline shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">Symptoms</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">
                {latestSymptom ? latestSymptom.symptom : 'No logs yet'}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {latestSymptom
                  ? `${latestSymptom.severity} • ${latestSymptom.duration || 'No duration added'}`
                  : 'Track symptoms to see your latest entry here'}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-100 p-2.5 text-rose-900 shadow-sm">
              <AlertCircle size={18} />
            </div>
          </div>
        </Link>
      </div>

      {/* Recommendations */}
      <div className="rounded-[28px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Daily recommendations
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">What to do next</h2>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-2.5 text-cyan-900 shadow-sm">
            <Sparkles size={17} />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {recommendations.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[20px] bg-[var(--color-surface-2)] px-4 py-3"
            >
              <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Graphs Area */}
      <div className="rounded-[28px] border border-black/5 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Today at a glance
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">Progress overview</h2>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-900 shadow-sm">
            <TrendingUp size={17} />
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)]">Hydration</span>
              <span className="text-xs text-[var(--color-text-muted)]">{waterProgress}%</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-3 rounded-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${waterProgress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)]">Sleep</span>
              <span className="text-xs text-[var(--color-text-muted)]">{sleepProgress}%</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-3 rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${sleepProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/nutrition"
        className="flex items-center justify-between rounded-[28px] border border-black/5 bg-[var(--color-surface)] p-5 no-underline shadow-[var(--shadow-sm)]"
      >
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">Nutrition</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--color-text)]">{nutritionScore}%</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Nutrition quality snapshot
          </p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-100 p-2.5 text-orange-900 shadow-sm">
          <Utensils size={18} />
        </div>
      </Link>
 {/* Bottom App Bar Navigation */}
      <nav className="bottom-nav">
        
        <button 
          onClick={() => navigate("/chatbot")} 
          className="nav-item text-blue-600 transition-colors hover:text-blue-700 border-none bg-transparent cursor-pointer"
        >
          <div className="nav-icon-bg flex items-center justify-center bg-blue-50 text-blue-600">
            <MessageCircle size={16} />
          </div>
          <span className="font-semibold">AI Chat</span>
        </button>

        <button 
          onClick={handleLogout} 
          className="nav-item transition-colors hover:text-red-600 border-none bg-transparent cursor-pointer"
        >
          <div className="nav-icon-bg flex items-center justify-center">
            <LogOut size={16} />
          </div>
          <span>Logout</span>
        </button>
      </nav>
    </section>
  )
}

export default Dashboard;