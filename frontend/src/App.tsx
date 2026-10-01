import { useState } from 'react'
import CodeEditor from './CodeEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1 className="text-3xl font-bold underline">Vite + React + TypeScript</h1>
    <CodeEditor />
    </>
  )
}

export default App
