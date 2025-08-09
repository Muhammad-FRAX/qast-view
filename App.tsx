
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, FileText, FilePlus, Users } from 'lucide-react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar, { SidebarItem } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import Templates from '@/pages/Templates';
import TemplateBuilder from '@/pages/TemplateBuilder';
import ReportGenerator from '@/pages/ReportGenerator';
import ReportPreview from '@/pages/ReportPreview';
import Login from '@/pages/Login';
import UserManagement from '@/pages/UserManagement';
import ChangePassword from '@/pages/ChangePassword';

const AppLayout = () => {
    const { currentUser } = useAuth();
  return (
    <div className="flex h-screen bg-background text-foreground">
      <div id="app-sidebar">
        <Sidebar>
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/" />
          <SidebarItem icon={<FileText size={20} />} text="Templates" to="/templates" />
          <SidebarItem icon={<FilePlus size={20} />} text="New Report" to="/reports/new" />
          {currentUser?.role === 'admin' && (
            <SidebarItem icon={<Users size={20} />} text="User Management" to="/users" />
          )}
        </Sidebar>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div id="app-header">
          <Header />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-secondary/20 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:templateId" element={<TemplateBuilder />} />
            <Route path="/reports/new" element={<ReportGenerator />} />
            <Route path="/reports/new/:templateId" element={<ReportGenerator />} />
            <Route path="/reports/preview/:reportId" element={<ReportPreview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="qastview-theme">
        <HashRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <AuthProvider>
                 <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route
                        path="/*"
                        element={
                        <ProtectedRoute>
                            <AppProvider>
                                <AppLayout />
                            </AppProvider>
                        </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </HashRouter>
    </ThemeProvider>
  );
}

export default App;