
import React from 'react';
import { ProjectProgressBlockData, ProjectStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';


const ProjectProgressBlock: React.FC<ProjectProgressBlockData> = ({ label, projects }) => {
  const statusVariantMap: Record<ProjectStatus, 'success' | 'warning' | 'danger' | 'default'> = {
    [ProjectStatus.COMPLETED]: 'success',
    [ProjectStatus.ON_TRACK]: 'success',
    [ProjectStatus.AT_RISK]: 'warning',
    [ProjectStatus.DELAYED]: 'danger',
  };
  
  const progressBarColorMap: Record<ProjectStatus, string> = {
    [ProjectStatus.COMPLETED]: 'bg-green-500',
    [ProjectStatus.ON_TRACK]: 'bg-blue-500',
    [ProjectStatus.AT_RISK]: 'bg-yellow-500',
    [ProjectStatus.DELAYED]: 'bg-red-500',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground px-4">
                <div className="col-span-6">Project Name</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Progress</div>
            </div>
            {/* Rows */}
            {projects.map(project => (
                 <div key={project.id} className="grid grid-cols-12 gap-4 items-center border-t py-3 px-4">
                    <div className="col-span-12 md:col-span-6 font-medium">{project.name}</div>
                    <div className="col-span-6 md:col-span-3">
                        <Badge variant={statusVariantMap[project.status]}>{project.status}</Badge>
                    </div>
                    <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                        <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                                className={cn("h-2.5 rounded-full", progressBarColorMap[project.status])}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{project.progress}%</span>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgressBlock;