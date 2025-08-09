
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ReportTemplate, ReportInstance } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

type AppContextType = {
  templates: ReportTemplate[];
  reports: ReportInstance[];
  getTemplate: (id: string) => ReportTemplate | undefined;
  saveTemplate: (template: ReportTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getReport: (id: string) => ReportInstance | undefined;
  saveReport: (report: ReportInstance) => Promise<void>;
  fetchAll: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<ReportInstance[]>([]);

  // Fetch all templates and reports from backend
  const fetchAll = async () => {
    try {
      const [tpls, rpts] = await Promise.all([
        apiFetch('/api/templates'),
        apiFetch('/api/reports'),
      ]);
      setTemplates(tpls);
      setReports(rpts);
    } catch (err) {
      setTemplates([]);
      setReports([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAll();
    } else {
      setTemplates([]);
      setReports([]);
    }
    // eslint-disable-next-line
  }, [token]);

  const getTemplate = (id: string) => templates.find(t => t.id === id);

  const saveTemplate = async (template: ReportTemplate) => {
    if (template.id && templates.some(t => t.id === template.id)) {
      // Update
      await apiFetch(`/api/templates/${template.id}`, {
        method: 'PUT',
        body: JSON.stringify(template),
      });
    } else {
      // Create
      await apiFetch('/api/templates', {
        method: 'POST',
        body: JSON.stringify(template),
      });
    }
    await fetchAll();
  };

  const deleteTemplate = async (id: string) => {
    await apiFetch(`/api/templates/${id}`, { method: 'DELETE' });
    await fetchAll();
  };

  const getReport = (id: string) => reports.find(r => r.id === id);

  const saveReport = async (report: ReportInstance) => {
    if (report.id && reports.some(r => r.id === report.id)) {
      // Update
      await apiFetch(`/api/reports/${report.id}`, {
        method: 'PUT',
        body: JSON.stringify(report),
      });
    } else {
      // Create
      await apiFetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify(report),
      });
    }
    await fetchAll();
  };

  const value: AppContextType = {
    templates,
    reports,
    getTemplate,
    saveTemplate,
    deleteTemplate,
    getReport,
    saveReport,
    fetchAll,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};