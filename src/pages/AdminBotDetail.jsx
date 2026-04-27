import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Settings, Users, Trash2, Save, Info, Play, Sliders, RefreshCw, AlertCircle, CheckCircle2, FilePlus, AlertTriangle, UserCheck, Upload, Download, Copy, Link2, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

export default function AdminBotDetail() {
  const { botId } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('documents');
  const [isCopied, setIsCopied] = useState(false);

  // Dummy bot data
  const botName = botId === 'bot-001' ? t('bot1Name') : botId === 'bot-002' ? t('bot2Name') : t('bot3Name');
  const botDesc = botId === 'bot-001' ? t('bot1Desc') : botId === 'bot-002' ? t('bot2Desc') : t('bot3Desc');
  const botUrl = `${window.location.origin}/chat/${botId}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(botUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6 lg:gap-8 h-full pb-16">
      
      {/* Header Card (Now positioned above layout on all screens) */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 sm:gap-4">
        <Link to="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors w-fit text-[13px] sm:text-sm font-medium">
          <ArrowLeft size={16} />
          <span>{t('back')}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{botName}</h2>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
           <span className="text-[11px] font-bold text-slate-500 tracking-wider w-32 shrink-0">{t('chatScreenUrl')}</span>
           <div className="flex items-center w-full gap-2 overflow-hidden">
             <button 
               onClick={handleCopyUrl}
               className="flex items-center gap-2 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors pl-3 pr-1.5 py-1.5 rounded-xl group shadow-[0_2px_10px_rgb(59,130,246,0.05)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-fit overflow-hidden"
             >
               <div className="flex items-center gap-1.5 overflow-hidden">
                 <Link2 size={14} className="text-blue-500 shrink-0" />
                 <span className="text-[12px] sm:text-[13px] text-blue-700 font-mono font-bold tracking-tight truncate max-w-[200px] sm:max-w-md select-all">{botUrl}</span>
               </div>
               <div className={cn("p-1.5 rounded-lg flex items-center justify-center shrink-0 transition-colors", isCopied ? "bg-emerald-100 text-emerald-600" : "bg-white border border-blue-100 shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white")}>
                 {isCopied ? <Check size={14} /> : <Copy size={14} />}
               </div>
             </button>
             {isCopied && <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in zoom-in duration-200 whitespace-nowrap">{t('copied')}</span>}
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse gap-4 sm:gap-6 lg:gap-8 items-start w-full">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-[240px] lg:w-[260px] shrink-0 bg-white border border-slate-200 shadow-sm rounded-xl p-2 sm:p-4 static md:sticky md:top-20 z-10">
          <h3 className="hidden md:block text-xs font-bold text-slate-400 mb-4 px-2 tracking-wide uppercase">{t('botSettingsMenu')}</h3>
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 p-1 md:p-0 scrollbar-hide">
            <MenuButton 
              active={activeTab === 'documents'} 
              onClick={() => setActiveTab('documents')}
              icon={<FileText size={16} className="sm:w-[18px] sm:h-[18px]" />}
              label={t('docManage')}
            />
            <MenuButton 
              active={activeTab === 'prompt'} 
              onClick={() => setActiveTab('prompt')}
              icon={<Settings size={16} className="sm:w-[18px] sm:h-[18px]" />}
              label={t('sysPrompt')}
            />
            <MenuButton 
              active={activeTab === 'access'} 
              onClick={() => setActiveTab('access')}
              icon={<UserCheck size={16} className="sm:w-[18px] sm:h-[18px]" />}
              label={t('accessUsers')}
            />
            <MenuButton 
              active={activeTab === 'admins'} 
              onClick={() => setActiveTab('admins')}
              icon={<Users size={16} className="sm:w-[18px] sm:h-[18px]" />}
              label={t('botAdmins')}
            />
            <MenuButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
              icon={<Sliders size={16} className="sm:w-[18px] sm:h-[18px]" />}
              label={t('botSettingsTab')}
            />
          </nav>
          <p className="hidden md:block text-[13px] text-slate-400 mt-8 px-3">{t('sampleNav')}</p>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'prompt' && <PromptTab />}
          {activeTab === 'access' && <AccessUsersTab />}
          {activeTab === 'admins' && <AdminsTab />}
          {activeTab === 'settings' && <BotSettingsTab />}
        </div>
      </div>

    </div>
  );
}

function MenuButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 sm:gap-3 px-3 sm:px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left whitespace-nowrap shrink-0",
        active 
          ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DocumentsTab() {
  const { t } = useLanguage();
  const documents = [
    // Updated
    { name: '旅費規程_2024.xlsx', ext: 'xlsx', syncState: 'updated', method: t('processExcelTable') },
    { name: 'セキュリティ基準_v3.pdf', ext: 'pdf', syncState: 'updated', method: t('processPdfBookmarks') },
    // New
    { name: 'コンプライアンス指針_v2.pdf', ext: 'pdf', syncState: 'new', method: t('processPdfBookmarks') },
    { name: 'リモートワークガイドライン_2026.docx', ext: 'docx', syncState: 'new', method: t('processExcelTable') },
    { name: '新入社員研修資料_2026.pptx', ext: 'pptx', syncState: 'new', method: t('processExcelTable') },
    // Deleted
    { name: '旧_製品FAQ(廃止).csv', ext: 'csv', syncState: 'deleted', method: t('processCsvTable') },
    { name: '組織図_2023.pdf', ext: 'pdf', syncState: 'deleted', method: t('processPdfBookmarks') },
    // Synced
    { name: '社内規程_2025.pdf', ext: 'pdf', syncState: 'synced', method: t('processPdfBookmarks') },
    { name: '経費精算フロー手順.pdf', ext: 'pdf', syncState: 'synced', method: t('processPdfImages') },
    { name: '用語集_全社共通.csv', ext: 'csv', syncState: 'synced', method: t('processCsvRow') },
  ];

  const groupedDocs = [
    { id: 'updated', label: t('statusUpdated'), desc: t('descUpdated'), docs: documents.filter(d => d.syncState === 'updated') },
    { id: 'new', label: t('statusNew'), desc: t('descNew'), docs: documents.filter(d => d.syncState === 'new') },
    { id: 'deleted', label: t('statusDeleted'), desc: t('descDeleted'), docs: documents.filter(d => d.syncState === 'deleted') },
    { id: 'synced', label: t('statusSynced'), desc: t('descSynced'), docs: documents.filter(d => d.syncState === 'synced') },
  ].filter(group => group.docs.length > 0);

  const pendingCount = documents.filter(d => d.syncState !== 'synced').length;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 relative pb-20">
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col gap-1.5 mb-6 md:mb-8 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-[17px] sm:text-lg font-bold text-slate-900">{t('docListTitle')}</h3>
            <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed mb-2 whitespace-pre-line">{t('docListSub')}</p>
          </div>
          <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-pointer selection:bg-slate-200 mt-2">
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
        </div>
        
        <div className="flex justify-between items-end pb-2 mb-4">
          <h4 className="text-sm font-semibold text-slate-700">{t('spFiles')}</h4>
        </div>

        {/* Summary Dashboard UI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
           <div className="flex flex-col gap-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('statusNew')}</span>
             <span className="text-2xl font-bold text-slate-800">{documents.filter(d => d.syncState === 'new').length}</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('statusUpdated')}</span>
             <span className="text-2xl font-bold text-slate-800">{documents.filter(d => d.syncState === 'updated').length}</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('statusDeleted')}</span>
             <span className="text-2xl font-bold text-slate-800">{documents.filter(d => d.syncState === 'deleted').length}</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('statusSynced')}</span>
             <span className="text-2xl font-bold text-slate-800">{documents.filter(d => d.syncState === 'synced').length}</span>
           </div>
        </div>

        <div className="flex flex-col gap-8 mb-4">
          {groupedDocs.map(group => (
            <div key={group.id} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <h5 className="text-sm font-bold text-slate-700 whitespace-nowrap">{group.label}</h5>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-relaxed max-w-2xl">{group.desc}</p>
              </div>
              <ul className="flex flex-col gap-2 md:gap-1 mt-1">
                {group.docs.map((doc, idx) => (
                  <li key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 md:py-2.5 px-3 rounded-lg border border-slate-100 md:border-transparent hover:bg-slate-50 md:hover:border-slate-100 transition-colors text-sm group gap-3 md:gap-0">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className={cn("transition-colors", doc.syncState === 'deleted' ? "text-red-400" : "text-slate-400")}>
                        <FileText size={16} />
                      </div>
                      <span className={cn("font-medium truncate pr-4", doc.syncState === 'deleted' ? "text-slate-500 line-through" : "text-slate-700")}>{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto scrollbar-hide pb-1 md:pb-0 shrink-0">
                      <span className="text-xs font-mono text-slate-400 w-8 md:text-right uppercase tracking-wider shrink-0">{doc.ext}</span>
                      <label className={cn("flex items-center gap-1.5 transition-colors shrink-0", doc.syncState === 'deleted' ? "opacity-50 cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-600 hover:text-slate-900")}>
                        <input type="checkbox" defaultChecked disabled={doc.syncState === 'deleted'} className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50" />
                        <span className="text-xs">{t('reference')}</span>
                      </label>
                      
                      {doc.syncState === 'deleted' ? (
                         <div className="w-32 md:w-40 text-left shrink-0">
                           <span className="text-xs text-red-500 font-medium">{t('syncDeletedNotice')}</span>
                         </div>
                      ) : (
                        <>
                          <select 
                            defaultValue={doc.method}
                            className="border border-slate-200 rounded-md px-2 py-1.5 w-32 md:w-40 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white hover:bg-slate-50 transition-all cursor-pointer text-[11px] font-medium shadow-sm shrink-0 truncate"
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
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            disabled={pendingCount === 0}
            className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:shadow-none shrink-0"
          >
            <RefreshCw size={16} className="fill-current" />
            <span>{t('syncAction')}</span>
          </button>
        </div>
      </div>

    </div>
  );
}

function PromptTab() {
  const { t } = useLanguage();
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px] sm:h-[500px]">
      <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-slate-900">{t('sysPrompt')}</h3>
          <p className="text-xs text-slate-500">{t('sysPromptSub')}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-sm font-medium">
          <Save size={14} />
          <span>{t('save')}</span>
        </button>
      </div>
      <textarea 
        className="flex-1 w-full border border-slate-200 bg-slate-50/50 rounded-lg p-4 resize-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono leading-relaxed transition-all shadow-inner placeholder-slate-400 outline-none"
        placeholder={t('sysPromptPlaceholder')}
      />
    </div>
  );
}

function AccessUsersTab() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([
     { email: 'guest_user1@example.com' },
     { email: 'department_manager@global.komatsu' }
  ]);
  const [newEmail, setNewEmail] = useState('');

  const handleDelete = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Dummy process
      setUsers([...users, { email: 'imported_user1@global.komatsu' }, { email: 'imported_user2@global.komatsu' }]);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-base font-bold text-slate-900">{t('accessUsers')}</h3>
        <p className="text-xs text-slate-500 mt-1">{t('accessUsersSub')}</p>
      </div>

      <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
           <a 
             href="data:text/csv;charset=utf-8,email%0Auser1@example.com" 
             download="template.csv"
             className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 shrink-0"
           >
             <Download size={14} />
             {t('csvDownload')}
           </a>
           
           <label className="w-full sm:w-auto ml-auto cursor-pointer flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-slate-200">
             <Upload size={14} />
             <span>{t('csvUpload')}</span>
             <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
           </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input 
            type="email" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="flex-1 border border-slate-300 bg-white rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all"
          />
          <button 
            onClick={() => {
              if (newEmail) {
                setUsers([{ email: newEmail }, ...users]);
                setNewEmail('');
              }
            }}
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 text-sm font-medium"
          >
            {t('add')}
          </button>
        </div>
      </div>
      
      <ul className="flex flex-col gap-2">
        {users.map((u, i) => (
          <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
               <div className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-[10px] uppercase shrink-0 font-bold border border-slate-200">
                 {u.email.charAt(0)}
               </div>
               <span className="text-[13px] sm:text-sm font-medium text-slate-700 truncate">{u.email}</span>
            </div>
            <button 
              onClick={() => handleDelete(i)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {users.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">{t('noEmails')}</p>
        )}
      </ul>
    </div>
  );
}

function AdminsTab() {
  const { t } = useLanguage();
  const [admins, setAdmins] = useState([
    { email: 'yasutaka_nakaizumi@global.komatsu' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const currentUserEmail = 'yasutaka_nakaizumi@global.komatsu'; // In real app, this would come from auth context

  const handleDelete = (email) => {
    if (email === currentUserEmail) {
      return; // Prevent self-deletion
    }
    setAdmins(admins.filter(admin => admin.email !== email));
  };

  const handleAdd = () => {
    if (newEmail) {
      setAdmins([...admins, { email: newEmail }]);
      setNewEmail('');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-base font-bold text-slate-900">{t('botAdmins')}</h3>
        <p className="text-xs text-slate-500 mt-1">{t('botAdminSub')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
        <input 
          type="email" 
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="flex-1 border border-slate-300 bg-white rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all"
        />
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 w-full sm:w-auto bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 text-sm font-medium"
        >
          {t('add')}
        </button>
      </div>
      
      <ul className="flex flex-col gap-2">
        {admins.map((admin, i) => (
          <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs uppercase shrink-0">
                 {admin.email.charAt(0)}
               </div>
               <span className="text-[13px] sm:text-sm font-medium text-slate-700 truncate">{admin.email}</span>
            </div>
            <button 
              onClick={() => handleDelete(admin.email)}
              disabled={admin.email === currentUserEmail}
              className={cn(
                "p-2 rounded-lg transition-colors",
                admin.email === currentUserEmail 
                  ? "text-slate-300 cursor-not-allowed" 
                  : "text-slate-400 hover:text-red-600 hover:bg-red-50"
              )}
              title={admin.email === currentUserEmail ? t('cannotDeleteSelf') : t('deleteLabel')}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {admins.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">{t('noAdmins')}</p>
        )}
      </ul>
    </div>
  );
}

function BotSettingsTab() {
  const { t } = useLanguage();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 relative">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">{t('botSettingsTab')}</h3>
      </div>
      
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('spBotLink')}</label>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] sm:text-sm text-slate-600 font-mono break-all line-clamp-2">
            https://global.komatsu/sites/Intranet/Shared%20Documents/Policies
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">{t('spBotLinkSub')}</p>
        </div>

        <div className="border-t border-slate-100 pt-5 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-800">{t('generalSettings')}</h4>
            <button className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-sm font-medium">
              <Save size={14} />
              <span>{t('save')}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('botDescription')} <span className="font-normal text-[10.5px] ml-2 text-slate-400">{t('botDescriptionNote')}</span></label>
            <textarea defaultValue="このボットは社内規定や業務マニュアルについて回答します。ご不明な点はお気軽にご質問ください。" placeholder={t('botDescriptionExample')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all resize-none min-h-[60px]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('botPurpose')}</label>
            <input type="text" defaultValue="社内規定に関するQAサポート" placeholder={t('botPurposeExample')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('defaultLanguage')}</label>
            <select defaultValue="ja" className="w-full sm:w-1/2 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm shadow-sm transition-all bg-white">
              <option value="ja">{t('japanese')}</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('sampleQuestions')} <span className="font-normal text-[10.5px] ml-2 text-slate-400">{t('sampleQuestionsNote')}</span></label>
            <div className="flex flex-col gap-2">
              <input type="text" defaultValue="経費精算のやり方を教えて" placeholder={t('sampleQuestion1Placeholder')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-[13px] shadow-sm transition-all" />
              <input type="text" defaultValue="交通費の上限はいくらですか？" placeholder={t('sampleQuestion2Placeholder')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-[13px] shadow-sm transition-all" />
              <input type="text" defaultValue="出張旅費規程の最新版を確認したい" placeholder={t('sampleQuestion3Placeholder')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-[13px] shadow-sm transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('systemPrompt')} <span className="font-normal text-[10.5px] ml-2 text-slate-400">{t('systemPromptNote')}</span></label>
            <textarea defaultValue={t('systemPromptDefault')} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-[13px] shadow-sm transition-all resize-none min-h-[100px]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{t('contactInfo')} <span className="font-normal text-[10.5px] ml-2 text-slate-400">{t('contactInfoNote')}</span></label>
            <div className="flex flex-col gap-2">
              <input type="text" defaultValue={t('contactMessageExample')} placeholder={t('contactMessageExample')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-[13px] shadow-sm transition-all" />
              <input type="url" defaultValue="https://forms.office.com/r/example" placeholder={t('contactLinkPlaceholder')} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 text-[13px] shadow-sm transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 mt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{t('creator')}</label>
            <p className="text-[13px] sm:text-sm text-slate-800 font-medium">yasutaka_nakaizumi@global.komatsu</p>
          </div>
          <div className="hidden sm:block"></div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{t('createdAt')}</label>
            <p className="text-[13px] sm:text-sm text-slate-800">2026/04/10 14:30</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{t('updatedAt')}</label>
            <p className="text-[13px] sm:text-sm text-slate-800">2026/04/22 09:15</p>
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 mt-2 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-50/50 p-4 rounded-lg border border-red-100">
           <div>
             <h4 className="text-sm font-bold text-red-800">{t('deleteBot')}</h4>
             <p className="text-xs text-red-600/80 mt-0.5">{t('deleteBotSub')}</p>
           </div>
           <button 
             onClick={() => setIsDeleteModalOpen(true)}
             className="shrink-0 whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors rounded-lg text-sm font-bold shadow-sm focus:ring-2 focus:ring-red-500/20 outline-none"
           >
             {t('deleteBot')}
           </button>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
             <h3 className="text-lg font-bold text-red-600 mb-2">{t('confirmDeleteBot')}</h3>
             <p className="text-sm text-slate-600 mb-6">{t('confirmDeleteBotMessage')}</p>
             <div className="flex justify-end gap-3 mt-2">
               <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">{t('cancel')}</button>
               <button onClick={() => window.location.href = '/admin'} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">{t('deleteBot')}</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
