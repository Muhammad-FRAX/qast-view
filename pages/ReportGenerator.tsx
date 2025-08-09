
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Wand2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { ReportTemplate, BlockType, RiskLevel, ReportBlockData, TitleBlockData, ProjectStatus, ProjectProgressItem } from '@/types';
import { generateId } from '@/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Label from '@/components/ui/Label';

const ReportGenerator: React.FC = () => {
    const { templateId: urlTemplateId } = useParams<{ templateId?: string }>();
    const navigate = useNavigate();
    const { templates, getTemplate, saveReport } = useAppContext();
    const { currentUser } = useAuth();

    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [reportName, setReportName] = useState('');
    const [reportAuthor, setReportAuthor] = useState(currentUser?.username || 'User');
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Set selected template from URL param on initial load
    useEffect(() => {
        if (urlTemplateId) {
            const template = getTemplate(urlTemplateId);
            if (template) {
                setSelectedTemplate(template);
            }
        } else {
            setSelectedTemplate(null);
        }
    }, [urlTemplateId, getTemplate]);

    // Initialize form data when a template is selected
    useEffect(() => {
        if (selectedTemplate) {
            const initialData: Record<string, any> = {};
            selectedTemplate.pages.forEach(page => {
                for (const block of page.blocks) {
                    initialData[block.id] = { ...block };
                }
            });
            setFormData(initialData);
            setReportName(`${selectedTemplate.name} Report - ${new Date().toLocaleDateString()}`);
        }
    }, [selectedTemplate]);

    const handleFieldChange = (blockId: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [blockId]: {
                ...prev[blockId],
                [field]: value
            }
        }));
    };

    const handleChartDataChange = (blockId: string, index: number, field: 'name' | 'value', value: string | number) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newData = [...(blockData.data || [])];
            
            const newPoint = {...newData[index]};
            if (field === 'value') {
                newPoint[field] = parseFloat(value as string) || 0;
            } else {
                newPoint[field] = value as string;
            }
            newData[index] = newPoint;
    
            return {
                ...prev,
                [blockId]: {
                    ...blockData,
                    data: newData,
                },
            };
        });
    };

    const addChartDataRow = (blockId: string) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newData = [...(blockData.data || []), { name: 'New', value: 100 }];
            return {
                ...prev,
                [blockId]: {
                    ...blockData,
                    data: newData,
                },
            };
        });
    };
    
    const removeChartDataRow = (blockId: string, index: number) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newData = [...(blockData.data || [])];
            newData.splice(index, 1);
            return {
                ...prev,
                [blockId]: {
                    ...blockData,
                    data: newData,
                },
            };
        });
    };

    const handleProjectChange = (blockId: string, projIndex: number, field: keyof ProjectProgressItem, value: any) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newProjects = [...(blockData.projects || [])];
            const newProject = {...newProjects[projIndex]};
            if (field === 'progress') {
                newProject[field] = parseInt(value, 10) || 0;
            } else {
                (newProject as any)[field] = value;
            }
            newProjects[projIndex] = newProject;
            return { ...prev, [blockId]: { ...blockData, projects: newProjects } };
        });
    };
    const addProjectRow = (blockId: string) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newProjects = [...(blockData.projects || []), { id: `proj-${generateId()}`, name: 'New Project', status: ProjectStatus.ON_TRACK, progress: 0 }];
            return { ...prev, [blockId]: { ...blockData, projects: newProjects } };
        });
    };
    const removeProjectRow = (blockId: string, projIndex: number) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newProjects = [...(blockData.projects || [])];
            newProjects.splice(projIndex, 1);
            return { ...prev, [blockId]: { ...blockData, projects: newProjects } };
        });
    };

    const handleListItemChange = (blockId: string, itemIndex: number, value: string) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newItems = [...(blockData.items || [])];
            newItems[itemIndex] = { ...newItems[itemIndex], content: value };
            return { ...prev, [blockId]: { ...blockData, items: newItems } };
        });
    };
    const addListItem = (blockId: string) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newItems = [...(blockData.items || []), { id: `item-${generateId()}`, content: '' }];
            return { ...prev, [blockId]: { ...blockData, items: newItems } };
        });
    };
    const removeListItem = (blockId: string, itemIndex: number) => {
        setFormData(prev => {
            const blockData = prev[blockId];
            const newItems = [...(blockData.items || [])];
            newItems.splice(itemIndex, 1);
            return { ...prev, [blockId]: { ...blockData, items: newItems } };
        });
    };

    const handleSaveReport = () => {
        if (!selectedTemplate) {
            toast.error("Please select a template first.");
            return;
        }
        if (!reportName.trim()) {
            toast.error("Report name is required.");
            return;
        }

        const newReportId = `report-${generateId()}`;
        const finalData: Record<string, any> = {};

        // Compare form data with template defaults and only save the difference
        selectedTemplate.pages.forEach(page => {
            for (const block of page.blocks) {
                const blockId = block.id;
                const originalBlock = block as any;
                const newBlockData = formData[blockId];
                const diff: Record<string, any> = {};

                Object.keys(newBlockData).forEach(key => {
                    // Deep comparison for arrays of objects like chart data
                    if ((key === 'data' || key === 'projects' || key === 'items') && Array.isArray(newBlockData[key])) {
                         if (JSON.stringify(originalBlock[key]) !== JSON.stringify(newBlockData[key])) {
                            diff[key] = newBlockData[key];
                        }
                    }
                    else if (key !== 'id' && originalBlock[key] !== newBlockData[key]) {
                        diff[key] = newBlockData[key];
                    }
                });

                if (Object.keys(diff).length > 0) {
                    finalData[blockId] = diff;
                }
            }
        });

        const newReport = {
            id: newReportId,
            templateId: selectedTemplate.id,
            name: reportName,
            author: reportAuthor,
            department: 'General',
            createdAt: new Date().toISOString(),
            data: finalData
        };

        saveReport(newReport);
        toast.success("Report created successfully!");
        navigate(`/reports/preview/${newReportId}`);
    };
    
    const renderBlockInput = (block: ReportBlockData) => {
        const data = formData[block.id];
        if (!data) return null;

        return (
            <Card key={block.id} className="bg-card/50">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">{block.label}</CardTitle>
                    <CardDescription>{block.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(() => {
                        switch (block.type) {
                            case BlockType.TITLE:
                                if (data.level === 'h1') {
                                    return (
                                        <>
                                            <div>
                                                <Label>Header Title</Label>
                                                <Input value={data.content || ''} onChange={(e) => handleFieldChange(block.id, 'content', e.target.value)} />
                                            </div>
                                             <div>
                                                <Label>Date</Label>
                                                <Input type="date" value={data.date ? data.date.split('T')[0] : ''} onChange={(e) => handleFieldChange(block.id, 'date', new Date(e.target.value).toISOString())} />
                                            </div>
                                            <div>
                                                <Label>Logo Image URL</Label>
                                                <Input value={data.logoSrc || ''} onChange={(e) => handleFieldChange(block.id, 'logoSrc', e.target.value)} />
                                            </div>
                                        </>
                                    );
                                }
                                // Level 'h2'
                                return (
                                    <div>
                                        <Label>Section Title</Label>
                                        <Input value={data.content || ''} onChange={(e) => handleFieldChange(block.id, 'content', e.target.value)} />
                                    </div>
                                );
                            case BlockType.KPI:
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Value</Label>
                                            <Input type="number" value={data.value || 0} onChange={(e) => handleFieldChange(block.id, 'value', parseFloat(e.target.value))} />
                                        </div>
                                        <div>
                                            <Label>Unit</Label>
                                            <Input value={data.unit || ''} onChange={(e) => handleFieldChange(block.id, 'unit', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <Label>Description</Label>
                                            <Textarea value={data.description || ''} onChange={(e) => handleFieldChange(block.id, 'description', e.target.value)} />
                                        </div>
                                    </div>
                                );
                            case BlockType.STATUS:
                                return (
                                    <>
                                        <div>
                                            <Label>Progress ({data.progress || 0}%)</Label>
                                            <Input className="w-full" type="range" min="0" max="100" value={data.progress || 0} onChange={(e) => handleFieldChange(block.id, 'progress', parseInt(e.target.value, 10))} />
                                        </div>
                                        <div>
                                            <Label>Risk Level</Label>
                                            <Select value={data.risk || RiskLevel.LOW} onChange={(e) => handleFieldChange(block.id, 'risk', e.target.value)}>
                                                {Object.values(RiskLevel).map(level => <option key={level} value={level}>{level}</option>)}
                                            </Select>
                                        </div>
                                    </>
                                );
                            case BlockType.TEXT:
                                return (
                                    <div>
                                        <Label>Content</Label>
                                        <Textarea value={data.content || ''} onChange={(e) => handleFieldChange(block.id, 'content', e.target.value)} rows={5} />
                                    </div>
                                );
                            case BlockType.IMAGE:
                                return (
                                    <div>
                                        <Label>Image URL</Label>
                                        <Input value={data.src || ''} onChange={(e) => handleFieldChange(block.id, 'src', e.target.value)} />
                                        {data.src && <img src={data.src} alt={data.alt || 'Report image'} className="mt-2 rounded-md max-h-24" />}
                                    </div>
                                );
                            case BlockType.CHART:
                                return (
                                    <div className="space-y-2">
                                        <Label>Chart Data</Label>
                                        {data.data.map((point: { name: string; value: number }, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Name"
                                                    value={point.name}
                                                    onChange={(e) => handleChartDataChange(block.id, index, 'name', e.target.value)}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    type="number"
                                                    value={point.value}
                                                    onChange={(e) => handleChartDataChange(block.id, index, 'value', e.target.value)}
                                                    className="w-24"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeChartDataRow(block.id, index)}
                                                    className="h-9 w-9"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addChartDataRow(block.id)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Data Point
                                        </Button>
                                    </div>
                                );
                            case BlockType.PROJECT_PROGRESS:
                                return (
                                    <div className="space-y-3">
                                        {data.projects.map((project: ProjectProgressItem, index: number) => (
                                            <div key={project.id} className="p-3 border rounded-md space-y-2">
                                                <div className="flex justify-end">
                                                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProjectRow(block.id, index)}>
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                     <div>
                                                         <Label>Project Name</Label>
                                                         <Input value={project.name} onChange={e => handleProjectChange(block.id, index, 'name', e.target.value)} />
                                                     </div>
                                                     <div>
                                                        <Label>Status</Label>
                                                        <Select value={project.status} onChange={e => handleProjectChange(block.id, index, 'status', e.target.value)}>
                                                            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                        </Select>
                                                     </div>
                                                      <div>
                                                        <Label>Progress (%)</Label>
                                                        <Input type="number" min="0" max="100" value={project.progress} onChange={e => handleProjectChange(block.id, index, 'progress', e.target.value)} />
                                                     </div>
                                                </div>
                                            </div>
                                        ))}
                                         <Button variant="outline" size="sm" onClick={() => addProjectRow(block.id)}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Project
                                        </Button>
                                    </div>
                                );
                             case BlockType.LIST:
                                return (
                                    <div className="space-y-2">
                                        {data.items.map((item: {id: string, content: string}, index: number) => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <Input value={item.content} onChange={e => handleListItemChange(block.id, index, e.target.value)} className="flex-1" />
                                                <Button variant="destructive" size="icon" onClick={() => removeListItem(block.id, index)} className="h-9 w-9">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                         <Button variant="outline" size="sm" onClick={() => addListItem(block.id)}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Item
                                        </Button>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })()}
                </CardContent>
            </Card>
        );
    };

    if (!selectedTemplate) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Create New Report</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Choose a Template</CardTitle>
                        <CardDescription>Select a template to build your report from.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.map(template => (
                            <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors flex flex-col" onClick={() => navigate(`/reports/new/${template.id}`)}>
                                <CardHeader>
                                    <FileText className="h-8 w-8 text-primary mb-2" />
                                    <CardTitle>{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{template.description}</p>
                                </CardContent>
                                <CardFooter>
                                     <p className="text-xs text-muted-foreground">{template.pages.reduce((acc, p) => acc + p.blocks.length, 0)} blocks</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => navigate('/reports/new')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Fill Report Data</h1>
                    <p className="text-muted-foreground">Using template: <span className="font-semibold text-primary">{selectedTemplate.name}</span></p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                     <div>
                        <Label>Report Name</Label>
                        <Input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="e.g., Q4 Financial Summary" />
                    </div>
                     <div>
                        <Label>Author</Label>
                        <Input value={reportAuthor} onChange={(e) => setReportAuthor(e.target.value)} />
                    </div>
                </CardContent>
            </Card>
            
             <div>
                {selectedTemplate.pages.map((page, index) => (
                    <div key={page.id} className="mt-6">
                         <h2 className="text-xl font-semibold mb-2 text-foreground">Page {index + 1}</h2>
                         <div className="space-y-4">
                            {page.blocks.map(renderBlockInput)}
                        </div>
                    </div>
                ))}
             </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
                 <Button variant="secondary" onClick={() => navigate('/reports/new')}>Change Template</Button>
                 <Button onClick={handleSaveReport}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Save & Preview Report
                </Button>
            </div>
        </div>
    );
};

export default ReportGenerator;