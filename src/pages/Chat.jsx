import { useState, useEffect } from 'react';
import { MessageCircle, Play, FileText, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [linkModal, setLinkModal] = useState({ isOpen: false, linkText: '', position: { top: 0, left: 0 } });

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newUserMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: t('sampleResponse')
      }]);
    }, 500);
  };

  const startNewChat = () => {
    setMessages([]);
  };

  const closeLinkModal = () => {
    setLinkModal({ isOpen: false, linkText: '', position: { top: 0, left: 0 } });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (linkModal.isOpen && !e.target.closest('.link-popover') && !e.target.closest('.reference-button')) {
        closeLinkModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [linkModal.isOpen, closeLinkModal]);

  return (
    <div className="flex-1 w-full bg-transparent flex flex-col relative h-full items-center justify-center py-4">
      <div className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 max-w-4xl mx-auto w-full h-auto max-h-[85vh] relative">
        <div className="bg-white sm:rounded-xl sm:border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="flex justify-end p-4">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md text-slate-600 bg-white hover:bg-slate-50 font-medium transition-all shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <MessageCircle size={14} />
            <span>{t('startNewChat')}</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth bg-white">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8 py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center gap-3 text-center">
                <svg 
                  viewBox="0 0 64 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-16 mb-2 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                >
                  <path 
                    d="M32 6C16.5 6 4 13.5 4 23C4 28.5 8.2 33.5 14.8 36.6C15.1 36.8 15.3 37.1 15.1 37.4L13 41.5C12.5 42.4 13.9 43.1 15 42.7L22.5 40.3C23.1 40.1 23.7 40.1 24.3 40.2C26.8 40.7 29.4 41 32 41C47.5 41 60 33.5 60 24C60 14.5 47.5 6 32 6Z" 
                    fill="#F8FAFC" 
                    stroke="#D1D5DB" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="24" r="2.2" fill="#94A3B8" />
                  <circle cx="32" cy="24" r="2.2" fill="#94A3B8" />
                  <circle cx="44" cy="24" r="2.2" fill="#94A3B8" />
                </svg>
                <p className="text-[13px] text-slate-500 max-w-md leading-relaxed mt-1">このボットは社内規定や業務マニュアルについて回答します。ご不明な点はお気軽にご質問ください。</p>
              </div>
              
              <div className="w-full mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "経費精算のやり方を教えて",
                    "交通費の上限はいくらですか？",
                    "出張旅費規程の最新版を確認したい"
                  ].map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setInput(q)}
                      className="text-center text-xs sm:text-[13px] text-slate-700 bg-white border border-slate-200 px-3 py-4 rounded-lg transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div 
                    className={cn(
                      "px-3 sm:px-4 py-2 sm:py-2.5 max-w-[90%] sm:max-w-[85%] whitespace-pre-wrap leading-relaxed text-[14px] sm:text-[14.5px]",
                      msg.role === 'user' 
                        ? "bg-slate-100 text-slate-900 rounded-lg" 
                        : "text-slate-800"
                    )}
                  >
                    {msg.role === 'bot' ? (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\[([^\]]+)\]/g, '') }} />
                        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          {msg.content.match(/\[([^\]]+)\]/g)?.map((ref, i) => (
                            <button 
                              key={i}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); const rect = e.target.getBoundingClientRect(); setLinkModal({ isOpen: true, linkText: ref.replace(/[\[\]]/g, ''), position: { top: rect.bottom + 8, left: rect.left } }); }}
                              className="reference-button text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-400 transition-colors mr-3"
                            >
                              {ref}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white flex flex-col gap-3">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto w-full relative group flex items-center">
            <input 
              type="text" 
              placeholder={t('inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-5 pr-12 py-3 sm:py-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-[14.5px] shadow-sm hover:shadow-md focus:shadow-md"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          
          <div className="max-w-3xl mx-auto w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs text-slate-500 text-center flex-wrap">
            <span>{t('chatContactMessage')}</span>
            <a href="https://forms.office.com/r/example" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center gap-1 transition-colors">
               {t('chatContactLink')}
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Link Action Popover */}
      {linkModal.isOpen && (
        <div 
          className="link-popover fixed z-50 animate-in fade-in zoom-in-95 duration-200"
          style={{ top: `${linkModal.position.top}px`, left: `${linkModal.position.left}px` }}
        >
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-2 min-w-[200px]">
            <p className="text-xs text-slate-600 px-2 py-1 border-b border-slate-100 mb-1">
              <span className="font-bold text-blue-600">{linkModal.linkText}</span>{t('referenceDisplayMethod')}
            </p>
            <div className="flex flex-col">
              <button 
                onClick={() => { window.open('#', '_blank'); setLinkModal({isOpen: false, linkText: '', position: { top: 0, left: 0 }}); }} 
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded transition-colors text-left"
              >
                <BookOpen size={14} />
                <span>{t('openRelevantSection')}</span>
              </button>
              <button 
                onClick={() => { window.open('#', '_blank'); setLinkModal({isOpen: false, linkText: '', position: { top: 0, left: 0 }}); }} 
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded transition-colors text-left"
              >
                <FileText size={14} className="text-slate-500" />
                <span>{t('openFullDocument')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
