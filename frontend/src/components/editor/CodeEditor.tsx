import { useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import Editor from '@monaco-editor/react';
import type {OnMount, OnChange, Monaco} from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
type props = {
  handleSubmit: () => void
  code: string
  setCode: Dispatch<SetStateAction<string>>
  selectedLanguage: string
  handleRun: () => void
  isRunning: boolean
  isSubmitting: boolean
}

function CodeEditor(
  {
    handleSubmit, 
    code, 
    setCode,
    selectedLanguage, 
    handleRun, 
    isRunning, 
    isSubmitting
  } : props) {

//   const [code, setCode] = useState('Hello');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount : OnMount = (editor, monacoInstance : Monaco) => {
    editorRef.current = editor;

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter
      ],
      run: () => {
        handleRun();
      }
    })

  }

  const handleEditorDidChange : OnChange = (value) => {
    setCode(value || '');
  }

  return (
    <div className="editor-container">
      <Editor 
        height="460px"
        defaultLanguage={selectedLanguage === 'c++' ? 'cpp' : selectedLanguage}
        language={selectedLanguage === 'c++' ? 'cpp' : selectedLanguage}
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
            fontSize: 14
          }
        }
      />
      <div className="editor-actions">
        <button className="run-button" type="button" onClick={handleRun} disabled={isRunning || isSubmitting}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button className="submit-button" type="button" onClick={handleSubmit} disabled={isRunning || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default CodeEditor