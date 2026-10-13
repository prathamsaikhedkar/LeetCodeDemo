import { useState } from 'react'
import CodeEditor from './components/editor/CodeEditor'
import LanguageSelector from './components/editor/LanguageSelector'

type ResultStatus = 'idle' | 'running' | 'accepted' | 'wrong-answer'

const starterCode: Record<string, string> = {
  python: 'def two_sum(nums, target):\n    # Write your solution here\n    pass',
  javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
  java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[] {};\n    }\n}',
  'c++': 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};',
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

  const isBusy = status === 'running' || isSubmitting

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">LC</span>
          <span>CodePractice</span>
        </div>
        <span className="difficulty-badge">Easy</span>
      </header>

      <div className="workspace">
        <section className="problem-panel" aria-label="Problem statement">
          <p className="eyebrow">Array · Hash Table</p>
          <h1>1. Two Sum</h1>
          <p>
            Given an array of integers <code>nums</code> and an integer{' '}
            <code>target</code>, return indices of the two numbers such that they
            add up to <code>target</code>.
          </p>
          <p>
            You may assume that each input would have exactly one solution, and
            you may not use the same element twice. You can return the answer in
            any order.
          </p>

          <h2>Examples</h2>
          <div className="example">
            <strong>Example 1</strong>
            <pre>Input: nums = [2,7,11,15], target = 9{'\n'}Output: [0,1]</pre>
            <span>Because nums[0] + nums[1] == 9.</span>
          </div>
          <div className="example">
            <strong>Example 2</strong>
            <pre>Input: nums = [3,2,4], target = 6{'\n'}Output: [1,2]</pre>
          </div>

          <h2>Constraints</h2>
          <ul>
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li>-10⁹ ≤ target ≤ 10⁹</li>
          </ul>
        </section>

        <section className="coding-panel" aria-label="Code editor">
          <div className="editor-toolbar">
            <LanguageSelector language={language} onChange={handleLanguageChange} />
            <span className="shortcut-hint">Ctrl + Enter to run</span>
          </div>
          <CodeEditor
            code={code}
            setCode={setCode}
            selectedLanguage={language}
            handleRun={runCode}
            handleSubmit={submitCode}
            isRunning={status === 'running'}
            isSubmitting={isSubmitting}
          />

          <div className="result-panel" aria-live="polite">
            <div className="result-heading">
              <strong>Test Result</strong>
              {status === 'running' && <span className="result-muted">Running tests...</span>}
              {isSubmitting && <span className="result-muted">Submitting...</span>}
            </div>
            {status === 'idle' && <p className="result-muted">Run your code to see the test results.</p>}
            {status === 'accepted' && (
              <div className="result-success">
                <strong>Accepted</strong>
                <span>All test cases passed · 48 ms · 17.2 MB</span>
              </div>
            )}
            {status === 'wrong-answer' && <p className="result-error">Wrong Answer</p>}
          </div>

          <div className="sample-input">
            <label htmlFor="sample-input">Testcase</label>
            <textarea id="sample-input" defaultValue={'[2,7,11,15]\ntarget = 9'} rows={3} />
          </div>
          <button className="secondary-button" type="button" onClick={() => setStatus('idle')} disabled={isBusy}>
            Reset result
          </button>
        </section>
      </div>
    </main>
  )
}

export default App
