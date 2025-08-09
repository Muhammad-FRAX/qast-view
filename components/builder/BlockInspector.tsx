
import React from 'react';
import { ReportBlockData, BlockType, ChartType, RiskLevel, TitleBlockData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

interface BlockInspectorProps {
  block: ReportBlockData;
  onUpdate: (id: string, updates: Partial<ReportBlockData>) => void;
  onClose: () => void;
}

const BlockInspector: React.FC<BlockInspectorProps> = ({ block, onUpdate }) => {
    
  const handleChange = (field: string, value: any) => {
    onUpdate(block.id, { [field]: value });
  };
  
  const handleLayoutChange = (field: string, value: any) => {
    onUpdate(block.id, { layout: { ...block.layout, [field]: value } });
  };

  const renderFields = () => {
    switch (block.type) {
      case BlockType.TITLE:
        const titleBlock = block as TitleBlockData;
        return (
          <>
            <Label htmlFor="level">Title Type</Label>
            <Select id="level" value={titleBlock.level} onChange={e => handleChange('level', e.target.value)}>
                <option value="h1">Header (h1)</option>
                <option value="h2">Section (h2)</option>
            </Select>

            <Label htmlFor="content">Text</Label>
            <Input id="content" value={titleBlock.content} onChange={e => handleChange('content', e.target.value)} />
            
            {titleBlock.level === 'h1' && (
                <>
                    <hr className="border-border my-4" />
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={titleBlock.author || ''} onChange={e => handleChange('author', e.target.value)} />
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={titleBlock.date ? titleBlock.date.split('T')[0] : ''} onChange={e => handleChange('date', new Date(e.target.value).toISOString())} />
                    <Label htmlFor="logoSrc">Logo Image URL</Label>
                    <Input id="logoSrc" value={titleBlock.logoSrc || ''} onChange={e => handleChange('logoSrc', e.target.value)} />
                    <Label htmlFor="logoAlt">Logo Alt Text</Label>
                    <Input id="logoAlt" value={titleBlock.logoAlt || ''} onChange={e => handleChange('logoAlt', e.target.value)} />
                </>
            )}
          </>
        );
      case BlockType.KPI:
        return (
          <>
            <Label htmlFor="value">Default Value</Label>
            <Input id="value" type="number" value={block.value} onChange={e => handleChange('value', parseFloat(e.target.value))} />
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" value={block.unit} onChange={e => handleChange('unit', e.target.value)} />
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={block.description} onChange={e => handleChange('description', e.target.value)} />
            <Label htmlFor="icon">Icon Name (from Lucide)</Label>
            <Input id="icon" value={block.icon} onChange={e => handleChange('icon', e.target.value)} />
          </>
        );
      case BlockType.TEXT:
        return (
          <>
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea id="content" rows={8} value={block.content} onChange={e => handleChange('content', e.target.value)} />
          </>
        );
      case BlockType.IMAGE:
        return (
          <>
            <Label htmlFor="src">Image URL</Label>
            <Input id="src" value={block.src} onChange={e => handleChange('src', e.target.value)} />
            <Label htmlFor="alt">Alt Text</Label>
            <Input id="alt" value={block.alt} onChange={e => handleChange('alt', e.target.value)} />
          </>
        );
      case BlockType.STATUS:
        return (
          <>
            <Label htmlFor="progress">Default Progress ({block.progress}%)</Label>
            <Input id="progress" type="range" min="0" max="100" value={block.progress} onChange={e => handleChange('progress', parseInt(e.target.value))} />
            <Label htmlFor="risk">Risk Level</Label>
            <Select id="risk" value={block.risk} onChange={e => handleChange('risk', e.target.value)}>
              {Object.values(RiskLevel).map(level => <option key={level} value={level}>{level}</option>)}
            </Select>
          </>
        );
      case BlockType.CHART:
        return (
          <>
            <Label htmlFor="chartType">Chart Type</Label>
            <Select id="chartType" value={block.chartType} onChange={e => handleChange('chartType', e.target.value)}>
              {Object.values(ChartType).map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
            <p className="text-sm text-muted-foreground mt-4">Chart data is entered when generating a new report.</p>
          </>
        );
       case BlockType.PROJECT_PROGRESS:
       case BlockType.LIST:
        return (
            <p className="text-sm text-muted-foreground mt-4">Data for this block is entered when generating a new report.</p>
        );
      default:
        return <p>This block has no specific options.</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit: {block.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <Label htmlFor="label">Block Label</Label>
            <Input id="label" value={block.label} onChange={e => handleChange('label', e.target.value)} />
        </div>
         <div>
            <Label htmlFor="colSpan">Column Span (1-12)</Label>
            <Input id="colSpan" type="number" min="1" max="12" value={block.layout?.colSpan || 12} onChange={e => handleLayoutChange('colSpan', parseInt(e.target.value))} />
        </div>
        <hr className="border-border" />
        {renderFields()}
      </CardContent>
    </Card>
  );
};

export default BlockInspector;