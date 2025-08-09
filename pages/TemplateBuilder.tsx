
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, GripVertical, File, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppContext } from '@/contexts/AppContext';
import { ReportTemplate, BlockType, ChartType, ReportBlockData, RiskLevel, ReportPage, TitleBlockData, KpiBlockData, TextBlockData, ImageBlockData, StatusBlockData, ChartBlockData, ProjectProgressBlockData, ListBlockData, ProjectStatus } from '@/types';
import { generateId, reorder } from '@/lib/utils';
import { cn } from '@/lib/utils';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BlockPalette from '@/components/builder/BlockPalette';
import BlockInspector from '@/components/builder/BlockInspector';

const TemplateBuilder: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const { getTemplate, saveTemplate } = useAppContext();

    const [template, setTemplate] = useState<ReportTemplate | null>(null);
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    
    // Drag and Drop State
    const [draggedBlock, setDraggedBlock] = useState<ReportBlockData | null>(null);

    useEffect(() => {
        if (templateId) {
            const fetchedTemplate = getTemplate(templateId);
            if (fetchedTemplate) {
                setTemplate(JSON.parse(JSON.stringify(fetchedTemplate))); // Deep copy for local state
                if (fetchedTemplate.pages.length > 0) {
                    setActivePageId(fetchedTemplate.pages[0].id);
                }
            } else {
                toast.error("Template not found!");
                navigate('/templates');
            }
        }
    }, [templateId, getTemplate, navigate]);

    const activePage = template?.pages.find(p => p.id === activePageId);
    const selectedBlock = activePage?.blocks.find(b => b.id === selectedBlockId);
    
    const handleSave = () => {
        if (template) {
            saveTemplate({ ...template, updatedAt: new Date().toISOString() });
            toast.success("Template saved successfully!");
        }
    };
    
    const updateTemplateDetails = (field: 'name' | 'description', value: string) => {
        if (template) {
            setTemplate({ ...template, [field]: value, updatedAt: new Date().toISOString() });
        }
    };

    const addBlock = (type: BlockType, options: Record<string, any> = {}) => {
        if (!activePageId) return;

        const getNewBlock = (): ReportBlockData => {
            const base = {
                id: `block-${generateId()}`,
                label: `New ${type} Block`,
                layout: { colSpan: 12 },
            };
    
            switch (type) {
                case BlockType.TITLE: {
                    const isHeader = options.level === 'h1';
                    const newBlock: TitleBlockData = {
                        ...base,
                        type: BlockType.TITLE,
                        label: isHeader ? 'Report Header' : 'Section Title',
                        level: options.level || 'h2',
                        content: isHeader ? 'Main Report Title' : 'Section Title',
                        author: isHeader ? 'Author Name' : undefined,
                        date: isHeader ? new Date().toISOString() : undefined,
                        logoSrc: isHeader ? 'https://picsum.photos/seed/qastviewlogo/150/50' : undefined,
                        logoAlt: isHeader ? 'Company Logo' : undefined,
                    };
                    return newBlock;
                }
                case BlockType.KPI: {
                    const newBlock: KpiBlockData = {
                        ...base,
                        type: BlockType.KPI,
                        value: 100,
                        unit: '$',
                        description: 'Description',
                        icon: 'Activity',
                        layout: { colSpan: 4 },
                    };
                    return newBlock;
                }
                case BlockType.CHART: {
                    const newBlock: ChartBlockData = {
                        ...base,
                        type: BlockType.CHART,
                        chartType: ChartType.BAR,
                        data: [ { name: 'A', value: 400 }, { name: 'B', value: 300 } ],
                        layout: { colSpan: 8 },
                    };
                    return newBlock;
                }
                case BlockType.STATUS: {
                    const newBlock: StatusBlockData = {
                        ...base,
                        type: BlockType.STATUS,
                        progress: 50,
                        risk: RiskLevel.LOW,
                        layout: { colSpan: 4 },
                    };
                    return newBlock;
                }
                case BlockType.TEXT: {
                    const newBlock: TextBlockData = {
                        ...base,
                        type: BlockType.TEXT,
                        content: 'This is a new text block. You can edit this content.',
                    };
                    return newBlock;
                }
                case BlockType.IMAGE: {
                    const newBlock: ImageBlockData = {
                        ...base,
                        type: BlockType.IMAGE,
                        src: 'https://picsum.photos/seed/qastview1/400/200',
                        alt: 'Placeholder Image',
                        layout: { colSpan: 6 },
                    };
                    return newBlock;
                }
                case BlockType.PROJECT_PROGRESS: {
                    const newBlock: ProjectProgressBlockData = {
                        ...base,
                        type: BlockType.PROJECT_PROGRESS,
                        label: 'Project Progress',
                        projects: [
                            {id: 'p1', name: 'Sample Project 1', status: ProjectStatus.ON_TRACK, progress: 50},
                            {id: 'p2', name: 'Sample Project 2', status: ProjectStatus.AT_RISK, progress: 25},
                        ],
                    };
                    return newBlock;
                }
                 case BlockType.LIST: {
                    const newBlock: ListBlockData = {
                        ...base,
                        type: BlockType.LIST,
                        label: 'New List',
                        items: [
                            {id: 'i1', content: 'Item 1'},
                            {id: 'i2', content: 'Item 2'},
                        ],
                        layout: { colSpan: 6 },
                    };
                    return newBlock;
                }
                default:
                    throw new Error(`Unsupported block type: ${type}`);
            }
        };

        const newBlock = getNewBlock();
        
        setTemplate(prevTemplate => {
            if (!prevTemplate) return null;
            const newPages = prevTemplate.pages.map(page => {
                if (page.id === activePageId) {
                    return { ...page, blocks: [...page.blocks, newBlock] };
                }
                return page;
            });
            return { ...prevTemplate, pages: newPages, updatedAt: new Date().toISOString() };
        });

        setSelectedBlockId(newBlock.id);
    };

    const updateBlock = (id: string, updates: Partial<ReportBlockData>) => {
        if (!activePageId) return;
        setTemplate(prev => {
            if (!prev) return null;
            const newPages = prev.pages.map(page => {
                if (page.id === activePageId) {
                    const newBlocks = page.blocks.map(block => {
                        if (block.id === id) {
                            return { ...block, ...updates } as ReportBlockData;
                        }
                        return block;
                    });
                    return { ...page, blocks: newBlocks };
                }
                return page;
            });
            return { ...prev, pages: newPages, updatedAt: new Date().toISOString() };
        });
    };
    
    const removeBlock = (id: string) => {
        if (!activePageId) return;
        setTemplate(prev => {
            if (!prev) return null;
            const newPages = prev.pages.map(page => {
                if (page.id === activePageId) {
                    return { ...page, blocks: page.blocks.filter(b => b.id !== id) };
                }
                return page;
            });
            if (selectedBlockId === id) setSelectedBlockId(null);
            return { ...prev, pages: newPages, updatedAt: new Date().toISOString() };
        });
    };

    const addPage = () => {
        setTemplate(prev => {
            if (!prev) return null;
            const newPage: ReportPage = { id: `page-${generateId()}`, blocks: [] };
            setActivePageId(newPage.id);
            return { ...prev, pages: [...prev.pages, newPage], updatedAt: new Date().toISOString() };
        });
    };

    const removePage = (id: string) => {
        setTemplate(prev => {
            if (!prev || prev.pages.length <= 1) {
                toast.error("Cannot delete the last page.");
                return prev;
            }
            const newPages = prev.pages.filter(p => p.id !== id);
            if (activePageId === id) {
                setActivePageId(newPages[0]?.id || null);
            }
            return { ...prev, pages: newPages, updatedAt: new Date().toISOString() };
        });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, block: ReportBlockData) => {
        setDraggedBlock(block);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBlock: ReportBlockData) => {
        e.preventDefault();
        if (!draggedBlock || !activePage || draggedBlock.id === targetBlock.id) return;

        const fromIndex = activePage.blocks.findIndex(b => b.id === draggedBlock.id);
        const toIndex = activePage.blocks.findIndex(b => b.id === targetBlock.id);

        if (fromIndex === -1 || toIndex === -1) return;

        const reorderedBlocks = reorder(activePage.blocks, fromIndex, toIndex);

        setTemplate(prev => {
            if (!prev) return null;
            const newPages = prev.pages.map(page => {
                if (page.id === activePageId) {
                    return { ...page, blocks: reorderedBlocks };
                }
                return page;
            });
            return { ...prev, pages: newPages, updatedAt: new Date().toISOString() };
        });
    };
    
    const handleDragEnd = () => {
        setDraggedBlock(null);
    };

    if (!template) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading template editor...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-background -m-6">
            <header className="flex items-center justify-between p-4 bg-card border-b border-border shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/templates')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <Input 
                            value={template.name}
                            onChange={(e) => updateTemplateDetails('name', e.target.value)}
                            className="text-lg font-bold border-none focus-visible:ring-1 focus-visible:ring-ring p-1 h-auto"
                        />
                        <Input 
                            value={template.description}
                            onChange={(e) => updateTemplateDetails('description', e.target.value)}
                            className="text-sm text-muted-foreground border-none focus-visible:ring-1 focus-visible:ring-ring h-8 p-1"
                            placeholder="Template description..."
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave}>Save Template</Button>
                </div>
            </header>
    
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-56 bg-card border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold">Pages</h2>
                    <div className="space-y-2">
                        {template.pages.map((page, index) => (
                            <div 
                                key={page.id} 
                                onClick={() => setActivePageId(page.id)}
                                className={cn(
                                    "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent",
                                    activePageId === page.id && "bg-accent text-accent-foreground"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    <span className="text-sm font-medium">Page {index + 1}</span>
                                </div>
                                {template.pages.length > 1 && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removePage(page.id); }}>
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addPage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Page
                    </Button>
                </aside>
                
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-secondary/30">
                    <div className="max-w-5xl mx-auto bg-card p-8 shadow-sm rounded-lg min-h-full">
                        <div className="grid grid-cols-12 gap-6">
                            {activePage && activePage.blocks.length > 0 ? (
                                activePage.blocks.map(block => (
                                    <div
                                        key={block.id}
                                        className={cn(
                                            'relative p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                                            selectedBlockId === block.id ? 'border-primary' : 'border-border hover:border-primary/50',
                                            `col-span-${block.layout?.colSpan || 12}`,
                                            draggedBlock?.id === block.id && 'opacity-50'
                                        )}
                                        onClick={() => setSelectedBlockId(block.id)}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, block)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, block)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="absolute top-1 right-1 flex items-center bg-card/80 p-1 rounded-bl-md backdrop-blur-sm">
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">{block.label}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{block.type}</p>
                                        {selectedBlockId === block.id && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute bottom-1 right-1 h-7 w-7"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeBlock(block.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                 <div className="col-span-12 text-center py-24 border-2 border-dashed border-border rounded-lg">
                                    <p className="text-muted-foreground">This page is empty.</p>
                                    <p className="text-sm text-muted-foreground">Add blocks from the panel on the right.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                
                <aside className="w-80 bg-card border-l border-border p-4 overflow-y-auto flex flex-col gap-4">
                    <BlockPalette onAddBlock={addBlock} />

                    {selectedBlock && (
                        <BlockInspector
                            key={selectedBlock.id}
                            block={selectedBlock}
                            onUpdate={updateBlock}
                            onClose={() => setSelectedBlockId(null)}
                        />
                    )}
                </aside>
            </div>
        </div>
    );
};

export default TemplateBuilder;