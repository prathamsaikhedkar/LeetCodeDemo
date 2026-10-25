import { Link } from '@tanstack/react-router'

export function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Practice Coding Problems
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
        Improve your coding skills with interactive problem solving, test running, and multiple programming language support.
      </p>
      <div className="mt-8">
        <Link
          to="/problems"
          className="inline-flex items-center rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
        >
          View Problems
        </Link>
      </div>
    </div>
  )
}

