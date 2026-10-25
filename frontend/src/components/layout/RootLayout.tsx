import { Outlet, Link } from '@tanstack/react-router'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-slate-900 no-underline">
          <span className="grid size-7 place-items-center rounded-md bg-amber-500 text-xs text-white">LC</span>
          <span>CodePractice</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 [&.active]:font-semibold [&.active]:text-amber-600"
          >
            Home
          </Link>
          <Link
            to="/problems"
            className="text-slate-600 hover:text-slate-900 [&.active]:font-semibold [&.active]:text-amber-600"
          >
            Problems
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

