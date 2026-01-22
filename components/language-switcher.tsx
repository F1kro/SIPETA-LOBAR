"use client"

import { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("ID")

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setCurrentLang(langCode === 'en' ? 'EN' : 'ID');
    }
  };

  return (
    <div className="relative group ml-2">
      <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl border border-slate-800 shadow-lg hover:bg-blue-600 transition-all active:scale-95 group">
        <Globe size={14} className="text-blue-400 group-hover:text-white transition-colors" />
        <span className="font-black text-[10px] uppercase tracking-widest">{currentLang}</span>
        <ChevronDown size={12} className="text-slate-500 group-hover:text-white" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] shadow-2xl">
        <button 
          onClick={() => changeLanguage('id')}
          className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white transition-colors border-b border-slate-800"
        >
          🇮🇩 Indo
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
        >
          🇺🇸 English
        </button>
      </div>
    </div>
  )
}