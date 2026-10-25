import { Link } from '@tanstack/react-router'

export function ProblemsPage() {
  const problems = [
    { id: '1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Problems</h1>
        <p className="text-sm text-slate-500">Select a problem to start practicing.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Difficulty</th>
              <th className="px-6 py-3">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">{problem.id}</td>
                <td className="px-6 py-4 font-medium text-amber-600 hover:underline">
                  <Link to="/problems/$problemId" params={{ problemId: problem.id }}>
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {problem.tags.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

