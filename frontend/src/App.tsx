import { useState } from 'react'
import CodeEditor from './components/editor/CodeEditor'
import LanguageSelector from './components/editor/LanguageSelector'

type ResultStatus = 'idle' | 'running' | 'accepted'

const starterCode: Record<string, string> = {
  python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass',
  javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
  java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[] {};\n    }\n}',
  cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};',
}

function App() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(starterCode.python)
  const [status, setStatus] = useState<ResultStatus>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLanguageChange = (nextLanguage: string) => {
    setLanguage(nextLanguage)
    setCode(starterCode[nextLanguage] ?? '')
    setStatus('idle')
  }

  const runCode = async () => {
    setStatus('running')
    await new Promise((resolve) => setTimeout(resolve, 700))
    setStatus('accepted')
  }

  const submitCode = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsSubmitting(false)
    setStatus('accepted')
  }

  const isRunning = status === 'running'
  const isBusy = isRunning || isSubmitting

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
        <div className="flex items-center gap-2.5 text-lg font-bold">
          <span className="grid size-7 place-items-center rounded-md bg-amber-500 text-xs text-white">LC</span>
          <span>CodePractice</span>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Easy</span>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-4 p-3 sm:p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 leading-relaxed sm:p-6" aria-label="Problem statement">
          <p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500">Array · Hash Table</p>
          <h1 className="mb-4 mt-1 text-2xl font-bold text-slate-900">1. Two Sum</h1>
          <p className="text-sm text-slate-600">
            Given an array of integers <code>nums</code> and an integer{' '}
            <code>target</code>, return indices of the two numbers such that they
            add up to <code>target</code>.
          </p>
          <p className="text-sm text-slate-600">
            You may assume that each input would have exactly one solution, and
            you may not use the same element twice. You can return the answer in
            any order.
          </p>

          <h2 className="mt-6 border-t border-slate-100 pt-4 text-base font-semibold">Examples</h2>
          <div className="my-3 rounded-md bg-slate-50 p-3 text-sm">
            <strong>Example 1</strong>
            <pre className="my-2 whitespace-pre-wrap text-xs">Input: nums = [2,7,11,15], target = 9{'\n'}Output: [0,1]</pre>
            <span className="text-xs text-slate-500">Because nums[0] + nums[1] == 9.</span>
          </div>
          <div className="my-3 rounded-md bg-slate-50 p-3 text-sm">
            <strong>Example 2</strong>
            <pre className="my-2 whitespace-pre-wrap text-xs">Input: nums = [3,2,4], target = 6{'\n'}Output: [1,2]</pre>
          </div>

          <h2 className="mt-6 border-t border-slate-100 pt-4 text-base font-semibold">Constraints</h2>
          <ul className="pl-5 text-sm text-slate-500">
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li>-10⁹ ≤ target ≤ 10⁹</li>
          </ul>
        </section>

        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 sm:p-6" aria-label="Code editor">
          <div className="mb-3 flex items-center justify-between">
            <LanguageSelector language={language} onChange={handleLanguageChange} />
            <span className="text-xs text-slate-400">Ctrl + Enter to run</span>
          </div>
          <CodeEditor
            code={code}
            setCode={setCode}
            selectedLanguage={language}
            resetCode={() => setCode(starterCode[language] ?? '')}
            handleRunCode={runCode}
            onSubmit={submitCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          <div className="mt-4 border-t border-slate-200 pt-4" aria-live="polite">
            <div className="mb-3 flex justify-between">
              <strong>Test Result</strong>
              {isRunning && <span className="text-xs text-slate-400">Running tests...</span>}
              {isSubmitting && <span className="text-xs text-slate-400">Submitting...</span>}
            </div>
            {status === 'idle' && <p className="text-xs text-slate-400">Run your code to see the test results.</p>}
            {status === 'accepted' && (
              <div className="flex gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-green-800">
                <strong>Accepted</strong>
                <span className="text-sm text-slate-600">All test cases passed · 48 ms · 17.2 MB</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold" htmlFor="sample-input">Testcase</label>
            <textarea className="w-full resize-y rounded-md border border-slate-300 p-2 text-sm" id="sample-input" defaultValue={'[2,7,11,15]\ntarget = 9'} rows={3} />
          </div>
          <button className="mt-3 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => setStatus('idle')} disabled={isBusy}>
            Reset result
          </button>
        </section>
      </div>
    </main>
  )
}

export default App
