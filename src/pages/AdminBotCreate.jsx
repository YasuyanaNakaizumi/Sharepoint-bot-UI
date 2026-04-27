import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Check, CheckCircle2, ChevronRight, FileText, Settings, Users, Link2, Bot, UserCheck, Edit2, Upload, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminBotCreate() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [botName, setBotName] = useState('');
  const [spUrl, setSpUrl] = useState('');
  
  // Scanned Docs State
  const [isScanning, setIsScanning] = useState(true);
  const [scannedDocs, setScannedDocs] = useState([]);
  
  // Prompt State
  const [systemPrompt, setSystemPrompt] = useState('');
  
  // Additional Bot Settings
  const [botPurpose, setBotPurpose] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('ja');
  const [sampleQ1, setSampleQ1] = useState('');
  const [sampleQ2, setSampleQ2] = useState('');
  const [sampleQ3, setSampleQ3] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLink, setContactLink] = useState('');
  
  // Access Users State
  const [accessUsers, setAccessUsers] = useState([]);
  const [newAccessEmail, setNewAccessEmail] = useState('');

  // Admins State  
  const [admins, setAdmins] = useState([{ email: 'yasutaka_nakaizumi@global.komatsu', role: 'Owner' }]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [hasDownloadedTemplate, setHasDownloadedTemplate] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (currentStep === 2 && scannedDocs.length === 0) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setScannedDocs([
          { name: 'コンプライアンス指針_v2.pdf', ext: 'pdf', method: t('processBookmark'), reference: true },
          { name: 'リモートワークガイドライン_2026.docx', ext: 'docx', method: t('processBookmark'), reference: true },
          { name: '新入社員研修資料_2026.pptx', ext: 'pptx', method: t('processBookmark'), reference: true }
        ]);
        setIsScanning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, scannedDocs.length, t]);

  const steps = [
    { id: 1, title: t('stepTitleSpUrl'), icon: Link2 },
    { id: 2, title: t('stepTitleDocs'), icon: FileText },
    { id: 3, title: t('stepTitlePrompt'), icon: Bot },
    { id: 4, title: t('stepTitleOther'), icon: Settings },
    { id: 5, title: t('stepTitleAccess'), icon: UserCheck },
    { id: 6, title: t('stepTitleAdmin'), icon: Users },
    { id: 7, title: t('stepTitleConfirm'), icon: Check },
  ];

  const handleNext = () => {
    if (currentStep < 7) setCurrentStep(s => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const executeCreate = () => {
    setIsCreateModalOpen(false);
    setIsCreating(true);
    setTimeout(() => {
      const newBot = {
        id: `bot-custom-${Date.now()}`,
        name: botName || 'New Bot',
        description: botDescription || (spUrl ? `連携先: ${spUrl}` : 'カスタムBot'),
        purpose: botPurpose,
        language: defaultLanguage,
        samples: [sampleQ1, sampleQ2, sampleQ3],
        contactMessage,
        contactLink
      };
      const savedBots = JSON.parse(localStorage.getItem('custom_bots') || '[]');
      localStorage.setItem('custom_bots', JSON.stringify([newBot, ...savedBots]));
      
      setIsCreating(false);
      navigate('/admin');
    }, 1500);
  };

  const handleUploadUsers = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAccessUsers(prev => [...prev, { email: 'imported_user1@global.komatsu' }, { email: 'imported_user2@global.komatsu' }]);
      e.target.value = '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full overflow-y-auto pb-6 sm:pr-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {t('botNameLabel')}
                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
              </label>
              <input 
                type="text" 
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder={t('botNamePlaceholder')}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                SharePoint URL
                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
              </label>
              <p className="text-xs text-slate-500">{t('spUrlSettingLabel')}</p>
              <input 
                type="url" 
                value={spUrl}
                onChange={(e) => setSpUrl(e.target.value)}
                placeholder={t('spUrlPlaceholder')}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
              <label className="text-sm font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  {t('botDescription')}
                  <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal">{t('botDescriptionNote')}</span>
              </label>
              <textarea 
                value={botDescription}
                onChange={(e) => setBotDescription(e.target.value)}
                placeholder="例: このボットは社内規定やマニュアルについて回答します。"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-sm text-sm min-h-[80px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {t('botPurpose')}
                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
              </label>
              <input 
                type="text" 
                value={botPurpose}
                onChange={(e) => setBotPurpose(e.target.value)}
                placeholder="例: 社内ヘルプデスク、営業資料検索など"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm shadow-sm"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5 mb-2">
              <h3 className="text-[17px] sm:text-lg font-bold text-slate-900">{t('docListTitle')}</h3>
              <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed whitespace-pre-line">{t('docListSub')}</p>
            </div>
             {isScanning ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-sm text-slate-600 font-bold">{t('waitScanning')}</span>
                </div>
             ) : (
                <div className="flex flex-col gap-4">
                  <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-pointer selection:bg-slate-200">
                    <summary className="px-4 py-3 text-sm font-bold text-slate-800 flex items-center justify-between outline-none">
                      {t('recommendedSettings')}
                      <span className="text-slate-500 transition-transform duration-300 group-open:rotate-180">▼</span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-700 flex flex-col gap-3 leading-relaxed">
                      <div>
                        <p className="font-bold mb-1">{t('pdfCase')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><span className="font-semibold">{t('processPdfBookmarks')}</span>{t('bookmarkProcessDesc')}</li>
                          <li><span className="font-semibold">{t('processPdfImages')}</span>{t('imageProcessDesc')}</li>
                        </ul>
                      </div>
                      <div>
                         <p className="font-bold mb-1">{t('excelCase')}</p>
                         <ul className="list-disc pl-4 space-y-1">
                           <li><span className="font-semibold">{t('processExcelTable')}</span>{t('tableProcessDesc')}</li>
                           <li><span className="font-semibold">{t('processExcelRow')}</span>{t('rowProcessDesc')}</li>
                           <li><span className="font-semibold">{t('processExcelImage')}</span>{t('sheetImageProcessDesc')}</li>
                         </ul>
                      </div>
                      <div>
                         <p className="font-bold mb-1">{t('csvCase')}</p>
                         <ul className="list-disc pl-4 space-y-1">
                           <li><span className="font-semibold">{t('processCsvTable')}</span>{t('tableProcessDesc')}</li>
                           <li><span className="font-semibold">{t('processCsvRow')}</span>{t('rowProcessDesc')}</li>
                         </ul>
                      </div>
                    </div>
                  </details>
                  
                  <ul className="flex flex-col gap-2 border border-slate-200 rounded-xl p-2 bg-slate-50">
                    {scannedDocs.map((doc, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-white border border-slate-100 shadow-sm gap-3 sm:gap-0">
                         <div className="flex items-center gap-3 max-w-full overflow-hidden">
                           <FileText size={16} className="text-slate-400 shrink-0" />
                           <span className="font-medium text-sm text-slate-700 truncate">{doc.name}</span>
                         </div>
                         <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
                           <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 shrink-0">
                             <input 
                               type="checkbox" 
                               checked={doc.reference} 
                               onChange={(e) => {
                                 const newDocs = [...scannedDocs];
                                 newDocs[idx].reference = e.target.checked;
                                 setScannedDocs(newDocs);
                               }}
                               className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                             />
                             <span className="text-xs font-bold">{t('reference')}</span>
                           </label>
                           <select 
                             value={doc.method}
                             onChange={(e) => {
                               const newDocs = [...scannedDocs];
                               newDocs[idx].method = e.target.value;
                               setScannedDocs(newDocs);
                             }}
                             className="border border-slate-200 rounded-md px-2 py-1.5 w-36 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm text-[11px] font-medium cursor-pointer truncate"
                           >
                              {doc.ext === 'pdf' && (
                                <>
                                  <option value={t('processPdfBookmarks')}>{t('processPdfBookmarks')}</option>
                                  <option value={t('processPdfImages')}>{t('processPdfImages')}</option>
                                </>
                              )}
                              {(doc.ext === 'xlsx' || doc.ext === 'xls' || doc.ext === 'pptx' || doc.ext === 'docx') && (
                                <>
                                  <option value={t('processExcelTable')}>{t('processExcelTable')}</option>
                                  <option value={t('processExcelRow')}>{t('processExcelRow')}</option>
                                  <option value={t('processExcelImage')}>{t('processExcelImage')}</option>
                                </>
                              )}
                              {doc.ext === 'csv' && (
                                <>
                                  <option value={t('processCsvTable')}>{t('processCsvTable')}</option>
                                  <option value={t('processCsvRow')}>{t('processCsvRow')}</option>
                                </>
                              )}
                           </select>
                         </div>
                      </li>
                    ))}
                  </ul>
                </div>
             )}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full overflow-y-auto pb-6 sm:pr-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                {t('systemPromptLabel')}
                <span className="text-[11px] text-slate-500 font-normal">{t('systemPromptNote')}</span>
              </label>
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder={t('sysPromptPlaceholder')}
                className="flex-1 min-h-[200px] w-full border border-slate-300 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-sm text-sm"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full overflow-y-auto pb-6 sm:pr-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {t('defaultLanguage')}
              </label>
              <select 
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full sm:w-1/2 border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all text-sm shadow-sm"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
              <label className="text-sm font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                {t('sampleQuestions')}
                <span className="text-[11px] text-slate-500 font-normal">{t('sampleQuestionsNote')}</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">{t('sampleQuestion1Label')}</label>
                  <input type="text" value={sampleQ1} onChange={(e) => setSampleQ1(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-[13px] shadow-sm"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">{t('sampleQuestion2Label')}</label>
                  <input type="text" value={sampleQ2} onChange={(e) => setSampleQ2(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-[13px] shadow-sm"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">{t('sampleQuestion3Label')}</label>
                  <input type="text" value={sampleQ3} onChange={(e) => setSampleQ3(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-[13px] shadow-sm"/>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
              <label className="text-sm font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                {t('contactInfo')}
                <span className="text-[11px] text-slate-500 font-normal">{t('contactInfoNote')}</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">{t('contactMessageLabel')}</label>
                  <input type="text" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-[13px] shadow-sm"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600">{t('contactLinkLabel')}</label>
                  <input type="url" value={contactLink} onChange={(e) => setContactLink(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-all text-[13px] shadow-sm"/>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed">{t('accessUsersSub')}</p>
             <p className="text-[12px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 leading-relaxed">{t('accessUsersExplanation')}</p>
             <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
               <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                 <button 
                   onClick={() => setHasDownloadedTemplate(true)}
                   className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 shrink-0"
                 >
                   <Download size={14} />
                   {t('csvDownload')}
                 </button>
                 <label className={cn(
                   "w-full sm:w-auto ml-auto flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition-all",
                   hasDownloadedTemplate 
                     ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm focus-within:ring-2 focus-within:ring-slate-200" 
                     : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                 )}>
                   <Upload size={14} />
                   <span>{t('csvUpload')}</span>
                   <input type="file" accept=".csv" className="hidden" disabled={!hasDownloadedTemplate} onChange={handleUploadUsers} />
                 </label>
               </div>
               {!hasDownloadedTemplate && (
                 <p className="text-[11px] text-amber-600 font-medium tracking-tight">{t('csvTemplateWarning')}</p>
               )}
             </div>
             
             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2">
                  <input 
                    type="email" 
                    value={newAccessEmail}
                    onChange={(e) => setNewAccessEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm shadow-sm"
                  />
                  <button 
                    onClick={() => {
                      if(newAccessEmail) {
                        setAccessUsers([{ email: newAccessEmail }, ...accessUsers]);
                        setNewAccessEmail('');
                      }
                    }}
                    className="bg-slate-800 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
                  >
                    {t('add')}
                  </button>
               </div>
               <ul className="flex flex-col gap-2 mt-2">
                  {accessUsers.map((user, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 sm:px-4 sm:py-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-sm font-medium text-slate-700 truncate">{user.email}</span>
                    </li>
                  ))}
               </ul>
             </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed">{t('botAdminSub')}</p>
             <div className="flex items-center gap-2">
                <input 
                  type="email" 
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm shadow-sm"
                />
                <button 
                  onClick={() => {
                    if(newAdminEmail) {
                      setAdmins([...admins, { email: newAdminEmail, role: 'Admin'}]);
                      setNewAdminEmail('');
                    }
                  }}
                  className="bg-slate-800 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
                >
                  {t('add')}
                </button>
             </div>
             <ul className="flex flex-col gap-2 mt-4">
                {admins.map((admin, idx) => (
                  <li key={idx} className="flex items-center justify-between p-3 sm:px-4 sm:py-3.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-700 truncate">{admin.email}</span>
                  </li>
                ))}
             </ul>
          </div>
        );
      case 7: // Confirmation
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col gap-2">
               <h4 className="text-[15px] font-bold text-slate-800">{t('confirmSettingLabel')}</h4>
             </div>
             
             <div className="flex flex-col gap-4">
                {/* General Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative group">
                  <button onClick={() => setCurrentStep(1)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors">
                    <Edit2 size={12} /> {t('editLabel')}
                  </button>
                  <h5 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">{t('basicSettings')}</h5>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-0.5">{t('botNameLabel')}</span>
                      <span className="text-sm font-bold text-slate-900">{botName || t('unentered')}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-0.5">SharePoint URL</span>
                      <span className="text-[13px] font-medium text-slate-900 break-all">{spUrl || t('unentered')}</span>
                    </div>
                  </div>
                </div>

                {/* Docs Preview */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative group">
                  <button onClick={() => setCurrentStep(2)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors">
                    <Edit2 size={12} /> {t('editLabel')}
                  </button>
                  <h5 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">{t('stepTitleDocs')}</h5>
                  <ul className="flex flex-col gap-1">
                    {scannedDocs.slice(0, 3).map((d, i) => (
                      <li key={i} className="text-[13px] font-medium text-slate-700 flex items-center gap-2 truncate">
                        <FileText size={14} className="text-slate-400 shrink-0" /> {d.name} <span className="text-[10px] text-slate-400">({d.method})</span>
                      </li>
                    ))}
                    {scannedDocs.length > 3 && <li className="text-[11px] text-slate-500 mt-1">{t('others')} {scannedDocs.length - 3} {t('count')}</li>}
                    {scannedDocs.length === 0 && <li className="text-xs text-slate-500">{t('notSet')}</li>}
                  </ul>
                </div>

                {/* System Prompt */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative group">
                  <button onClick={() => setCurrentStep(3)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors">
                    <Edit2 size={12} /> {t('editLabel')}
                  </button>
                  <h5 className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase">{t('sysPrompt')}</h5>
                  {systemPrompt ? (
                    <p className="text-[13px] font-medium text-slate-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">{systemPrompt}</p>
                  ) : <span className="text-[13px] text-slate-400 italic">{t('notSet')}</span>}
                </div>

                {/* Users & Admins Preview */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative group">
                    <button onClick={() => setCurrentStep(5)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors">
                      <Edit2 size={12} /> {t('editLabel')}
                    </button>
                    <h5 className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase">{t('accessUsers')}</h5>
                    <p className="text-2xl font-bold text-slate-800">{accessUsers.length === 0 ? t('allUsers') : accessUsers.length}<span className="text-xs font-medium text-slate-500 ml-1">名</span></p>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative group">
                    <button onClick={() => setCurrentStep(6)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold uppercase transition-colors">
                      <Edit2 size={12} /> {t('editLabel')}
                    </button>
                    <h5 className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase">{t('stepTitleAdmin')}</h5>
                    <p className="text-2xl font-bold text-slate-800">{admins.length}<span className="text-xs font-medium text-slate-500 ml-1">名</span></p>
                  </div>
                </div>

             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !botName.trim() || !spUrl.trim() || !botDescription.trim() || !botPurpose.trim();
    if (currentStep === 2) return isScanning;
    return false;
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-transparent overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col gap-6 min-h-full">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCancelModalOpen(true)}
            className="p-2 hover:bg-slate-200 text-slate-500 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('createNewBot')}</h1>
          </div>
        </div>

        {/* Wizard Container */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse">
          
          {/* Progress Sidebar (Menu List) */}
          <div className="bg-slate-50 border-b md:border-b-0 md:border-l border-slate-100 px-4 py-4 md:p-6 overflow-x-auto scrollbar-hide md:w-56 lg:w-64 shrink-0">
            <div className="flex items-center md:flex-col md:items-stretch min-w-max md:min-w-0 md:gap-2">
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center md:flex-col md:items-start group md:w-full">
                    <div 
                      onClick={() => { if (isCompleted) setCurrentStep(step.id); }}
                      className={cn(
                        "flex items-center justify-between md:justify-start gap-1.5 sm:gap-2 px-3 py-1.5 md:py-3 md:px-4 md:w-full rounded-full md:rounded-xl md:rounded-l-none md:rounded-r-xl transition-colors duration-300 shadow-sm border",
                        isActive ? "bg-blue-50 border-blue-200 shadow-sm md:-ml-[1px]" : 
                        isCompleted ? "bg-white border-emerald-200 cursor-pointer hover:bg-emerald-50" : "bg-white border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {isCompleted ? (
                          <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <step.icon size={14} className={isActive ? "text-blue-500 shrink-0" : "text-slate-400 shrink-0"} />
                        )}
                        <span className={cn(
                          "text-xs font-bold whitespace-nowrap",
                          isActive ? "text-blue-700" : isCompleted ? "text-emerald-700" : "text-slate-400"
                        )}>{step.title}</span>
                      </div>
                    </div>
                    {/* Progress Lines connecting steps */}
                    {idx < steps.length - 1 && (
                      <div className={cn(
                        "w-4 h-px mx-1.5 shrink-0 transition-colors duration-300 md:w-0.5 md:h-4 md:mx-auto md:my-0.5 md:ml-8",
                        isCompleted ? "bg-emerald-400" : "bg-slate-200"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Form Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Form Content */}
            <div className="flex-1 p-5 sm:p-8 md:p-10 flex flex-col bg-white overflow-y-auto">
              <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
                {renderStepContent()}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between shrink-0">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1 || isCreating}
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-sm transition-colors",
                currentStep > 1 
                  ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm" 
                  : "bg-transparent text-transparent cursor-default pointer-events-none"
              )}
            >
              {t('back')}
            </button>
            
            {currentStep < 7 ? (
              <button 
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t('nextStep')}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleCreateClick}
                disabled={isCreating}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 font-bold text-sm disabled:opacity-70 disabled:cursor-wait"
              >
                {isCreating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                <span>{t('createAction')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
             <h3 className="text-lg font-bold text-slate-900 mb-2">作成の確認</h3>
             <p className="text-[13px] text-slate-600 mb-6 whitespace-pre-wrap leading-relaxed">{t('confirmCreateMessage')}</p>
             <div className="flex justify-end gap-3 mt-2">
               <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">キャンセル</button>
               <button onClick={executeCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">{t('createAction')}</button>
             </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
             <h3 className="text-lg font-bold text-slate-900 mb-2">作成の中止</h3>
             <p className="text-[13px] text-slate-600 mb-6">入力中の内容は保存されません。新規作成を中止して一覧に戻りますか？</p>
             <div className="flex justify-end gap-3 mt-2">
               <button onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">とどまる</button>
               <button onClick={() => navigate(-1)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">中止する</button>
             </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
