
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const Dashboard: React.FC = () => {
  const { reports, templates } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/reports/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Report
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Managed in QastView</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map(report => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle>{report.name}</CardTitle>
                  <CardDescription>
                    Created by {report.author} in {report.department} on {new Date(report.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                   <Badge variant="secondary">Based on: {templates.find(t => t.id === report.templateId)?.name || 'Unknown Template'}</Badge>
                   <Link to={`/reports/preview/${report.id}`}>
                      <Button variant="outline">View Report</Button>
                   </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No reports found.</p>
                <Link to="/reports/new" className="mt-4 inline-block">
                    <Button>Create your first report</Button>
                </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;