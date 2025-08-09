
import React from 'react';
import { Heading1, Heading2, ListChecks, Type, Image, PieChart, BarChart, ClipboardList, ListPlus } from 'lucide-react';
import { BlockType } from '@/types';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface BlockPaletteProps {
  onAddBlock: (type: BlockType, options?: Record<string, any>) => void;
}

const blockOptions = [
  { type: BlockType.TITLE, label: 'Header', icon: <Heading1 className="h-5 w-5" />, options: { level: 'h1' } },
  { type: BlockType.TITLE, label: 'Section Title', icon: <Heading2 className="h-5 w-5" />, options: { level: 'h2' } },
  { type: BlockType.KPI, label: 'KPI', icon: <BarChart className="h-5 w-5" /> },
  { type: BlockType.TEXT, label: 'Text', icon: <Type className="h-5 w-5" /> },
  { type: BlockType.IMAGE, label: 'Image', icon: <Image className="h-5 w-5" /> },
  { type: BlockType.CHART, label: 'Chart', icon: <PieChart className="h-5 w-5" /> },
  { type: BlockType.STATUS, label: 'Status', icon: <ListChecks className="h-5 w-5" /> },
  { type: BlockType.PROJECT_PROGRESS, label: 'Projects', icon: <ClipboardList className="h-5 w-5" /> },
  { type: BlockType.LIST, label: 'List', icon: <ListPlus className="h-5 w-5" /> },
];

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Blocks</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {blockOptions.map(({ type, label, icon, options }) => (
          <Button
            key={label}
            variant="outline"
            className="flex flex-col h-20 justify-center items-center gap-1"
            onClick={() => onAddBlock(type, options)}
          >
            {icon}
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default BlockPalette;