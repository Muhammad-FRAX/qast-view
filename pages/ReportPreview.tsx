
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ChevronLeft } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import ReportCanvas from '@/components/report/ReportCanvas';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { generatePdf } from '@/lib/pdfGenerator';

const ReportPreview: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { getReport, getTemplate } = useAppContext();

  const report = reportId ? getReport(reportId) : undefined;
  const template = report ? getTemplate(report.templateId) : undefined;

  const handleDownload = async () => {
    if (report) {
      toast.loading('Generating PDF...', { id: 'pdf-toast' });
      await generatePdf('pdf-export-area', `${report.name}`);
      toast.success('PDF downloaded!', { id: 'pdf-toast' });
    }
  };

  if (!report || !template) {
    return (
      <div className="text-center">
        <h2 className="text-xl">Report not found.</h2>
        <Button onClick={() => navigate('/')} className="mt-4">Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pdf-controls">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Report Preview</h1>
        </div>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <div id="pdf-export-area">
        <ReportCanvas template={template} reportData={report} />
      </div>

    </div>
  );
};

export default ReportPreview;