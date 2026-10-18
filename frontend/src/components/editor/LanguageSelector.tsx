import { languages } from "./../../data/languages";

type LanguageSelectorProps = {
  language: string
  onChange: (language: string) => void
}

function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <label>
      <span className="sr-only">Programming language</span>
      <select className="cursor-pointer rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900" value={language} onChange={(event) => onChange(event.target.value)}>
        {languages.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name[0].toUpperCase() + item.name.slice(1)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSelector