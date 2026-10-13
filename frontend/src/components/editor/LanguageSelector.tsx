import { languages } from "./../../data/languages";

type LanguageSelectorProps = {
  language: string
  onChange: (language: string) => void
}

function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <label className="language-select">
      <span className="sr-only">Programming language</span>
      <select value={language} onChange={(event) => onChange(event.target.value)}>
        {languages.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name === 'c++' ? 'C++' : item.name[0].toUpperCase() + item.name.slice(1)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSelector