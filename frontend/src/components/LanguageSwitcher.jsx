import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'kn', native: 'ಕನ್ನಡ' },
  { code: 'bn', native: 'বাংলা' },
  { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' },
  { code: 'ml', native: 'മലയാളം' },
]

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  return (
    <div className={'relative flex items-center gap-1.5 ' + className}>
      <Globe size={14} className="text-gray-400 shrink-0" />
      <select
        value={i18n.language?.split('-')[0] || 'en'}
        onChange={e => i18n.changeLanguage(e.target.value)}
        className="text-sm bg-transparent border-none focus:outline-none text-gray-600 cursor-pointer pr-1 font-medium"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.native}</option>
        ))}
      </select>
    </div>
  )
}
