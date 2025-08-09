
import React from 'react';
import { StatusBlockData, RiskLevel } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const StatusBlock: React.FC<StatusBlockData> = ({ label, progress, risk }) => {
  const riskVariantMap: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
    [RiskLevel.LOW]: 'success',
    [RiskLevel.MEDIUM]: 'warning',
    [RiskLevel.HIGH]: 'danger',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
            <Badge variant={riskVariantMap[risk]}>{risk} Risk</Badge>
            <p className="text-sm font-semibold text-foreground">{progress}% Complete</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div
            className={cn(
                "h-2.5 rounded-full",
                risk === RiskLevel.HIGH && "bg-red-500",
                risk === RiskLevel.MEDIUM && "bg-yellow-500",
                risk === RiskLevel.LOW && "bg-green-500",
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBlock;