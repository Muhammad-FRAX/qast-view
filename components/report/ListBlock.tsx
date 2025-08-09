
import React from 'react';
import { ListBlockData } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const ListBlock: React.FC<ListBlockData> = ({ label, items }) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {items.map(item => (
                    <li key={item.id}>{item.content}</li>
                ))}
            </ul>
        </CardContent>
    </Card>
  );
};

export default ListBlock;