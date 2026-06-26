import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-lg rounded-[28px] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-md)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-[var(--color-text-muted)]">
          The page you tried to open does not exist in this app.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)]"
        >
          Go to dashboard
        </Link>
      </div>
    </section>
  )
}

export default NotFound