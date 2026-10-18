import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Editor from '@monaco-editor/react';
import type {OnMount, OnChange, Monaco} from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import ActionBar from './ActionBar';
type props = {
  code: string
  setCode: Dispatch<SetStateAction<string>>
  selectedLanguage: string
  resetCode: () => void
  handleRunCode: () => void
  onSubmit: () => void
  isRunning: boolean
  isSubmitting: boolean
}

function CodeEditor({ code, setCode, selectedLanguage, resetCode, handleRunCode, onSubmit, isRunning, isSubmitting }: props) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(14);

  const handleEditorDidMount : OnMount = (editor, monacoInstance : Monaco) => {
    editorRef.current = editor;

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter
      ],
      run: () => {
        handleRunCode();
      }
    })

  }

  const handleEditorDidChange : OnChange = (value) => {
    setCode(value || '');
  }

  const updateFontSize = (change: number) => {
    const nextFontSize = Math.min(24, Math.max(10, fontSize + change));
    setFontSize(nextFontSize);
    editorRef.current?.updateOptions({ fontSize: nextFontSize });
  }

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-end gap-1 border-b border-slate-700 bg-[#1e1e1e] px-3 py-2">
        <button
          className="rounded px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
          type="button"
          onClick={resetCode}
          disabled={isRunning || isSubmitting}
          title="Reset code"
        >
          Reset
        </button>
        <button
          className="rounded px-2 py-1 text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          type="button"
          onClick={() => updateFontSize(-1)}
          disabled={fontSize <= 10}
          title="Zoom out"
        >
          A-
        </button>
        <span className="w-8 text-center text-xs text-slate-400">{fontSize}</span>
        <button
          className="rounded px-2 py-1 text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          type="button"
          onClick={() => updateFontSize(1)}
          disabled={fontSize >= 24}
          title="Zoom in"
        >
          A+
        </button>
      </div>
      <Editor
        height="460px"
        defaultLanguage={selectedLanguage}
        language={selectedLanguage}
        value={code}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorDidChange}
        options={
          {
            tabCompletion : 'off',
            tabSize: 2,
            minimap: {enabled: false},
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize
          }
        }
      />
      <ActionBar onRun={handleRunCode} onSubmit={onSubmit} isRunning={isRunning} isSubmitting={isSubmitting} />
    </div>
  )
}

export default CodeEditor