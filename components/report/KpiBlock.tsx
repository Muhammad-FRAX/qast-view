
import React from 'react';
import { KpiBlockData } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

const KpiBlock: React.FC<KpiBlockData> = ({ label, value, unit, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon && <Icon name={icon} className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {value.toLocaleString()} 
            {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default KpiBlock;