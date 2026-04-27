import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Edit2, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Admin() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const defaultBots = [
    { id: 'bot-001', name: t('bot1Name'), description: t('bot1Desc') },
    { id: 'bot-002', name: t('bot2Name'), description: t('bot2Desc') },
    { id: 'bot-003', name: t('bot3Name'), description: t('bot3Desc') }
  ];

  const [bots, setBots] = useState(defaultBots);

  useEffect(() => {
    const saved = localStorage.getItem('custom_bots');
    if (saved) {
      try {
        const customBots = JSON.parse(saved);
        setBots([...customBots, ...defaultBots]);
      } catch (e) {
        console.error(e);
      }
    }
  }, [t]);

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-4 sm:px-6 sm:py-8 flex flex-col gap-4 sm:gap-6">
      
      {/* Page Title Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-slate-900">{t('botListTitle')}</h1>
          <p className="text-slate-500 text-sm">{t('botListSub')}</p>
        </div>
        <button
          onClick={() => navigate('/admin/bot/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold text-sm shrink-0"
        >
          <Plus size={16} />
          {t('createNewBot')}
        </button>
      </div>

      {/* Bot List Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <ul className="divide-y divide-slate-100">
          {bots.map((bot) => (
            <li key={bot.id} className="p-4 sm:p-5 lg:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col gap-1 w-full overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="text-slate-400">
                     <Bot size={18} />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-800 truncate">{bot.name}</h3>
                  {bot.id.startsWith('bot-custom') && (
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Custom</span>
                  )}
                </div>
                <p className="text-slate-500 text-[13.5px] sm:ml-6 truncate">{bot.description}</p>
              </div>
              <Link 
                to={`/admin/bot/${bot.id}`}
                className="flex items-center justify-center w-full sm:w-auto gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-sm shrink-0 font-medium"
              >
                <Edit2 size={14} />
                <span>{t('edit')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
