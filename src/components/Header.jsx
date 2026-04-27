import { MessageSquare, Shield, Globe, LogOut } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 min-h-14 py-2 sm:py-0 flex items-center sticky top-0 z-20 w-full">
      <div className="w-full max-w-4xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 lg:px-8 gap-y-3">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
            {isAdmin ? t('adminHeaderTitle') : t('headerTitle')}
            <span className="text-[12px] font-normal text-slate-500 tracking-normal">{isAdmin ? t('adminHeaderSubtitle') : t('headerSubtitle')}</span>
          </h1>
        </div>

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 sm:gap-6">
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-[13px] sm:text-sm",
                  isActive 
                    ? "text-blue-600 bg-blue-50/50" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                )
              }
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
              <span>{t('chat')}</span>
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-[13px] sm:text-sm",
                  isActive 
                    ? "text-blue-600 bg-blue-50/50" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                )
              }
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
              <span>{t('admin')}</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors bg-white border border-slate-200/80 shadow-sm rounded-md px-1.5 sm:px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-1 text-[12px] sm:text-[13px]"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>
            <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors group text-[12px] sm:text-[13px]">
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
