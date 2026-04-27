import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import AdminBotDetail from './pages/AdminBotDetail';
import AdminBotCreate from './pages/AdminBotCreate';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col font-sans text-slate-800 selection:bg-slate-200 selection:text-slate-900">
          <Header />
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/bot/new" element={<AdminBotCreate />} />
              <Route path="/admin/bot/:botId" element={<AdminBotDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
