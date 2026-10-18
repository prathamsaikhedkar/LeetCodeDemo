type ActionBarProps = {
  onRun: () => void
  onSubmit: () => void
  isRunning: boolean
  isSubmitting: boolean
}

function ActionBar({ onRun, onSubmit, isRunning, isSubmitting }: ActionBarProps) {
  const isBusy = isRunning || isSubmitting

  return (
    <div className="flex justify-end gap-2 bg-[#1e1e1e] p-3">
      <button
        className="rounded-md bg-slate-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={onRun}
        disabled={isBusy}
      >
        {isRunning ? 'Running...' : 'Run'}
      </button>
      <button
        className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={onSubmit}
        disabled={isBusy}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

export default ActionBar