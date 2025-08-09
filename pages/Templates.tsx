
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Copy, Trash2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { generateId } from '@/lib/utils';


const Templates: React.FC = () => {
  const { templates, saveTemplate, deleteTemplate } = useAppContext();
  const navigate = useNavigate();

  const handleClone = (templateId: string) => {
    const templateToClone = templates.find(t => t.id === templateId);
    if(templateToClone) {
        const newTemplate = {
            ...JSON.parse(JSON.stringify(templateToClone)), // Deep clone
            id: `template-${generateId()}`,
            name: `${templateToClone.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        saveTemplate(newTemplate);
        toast.success('Template cloned successfully!');
    }
  };

  const handleDelete = (templateId: string) => {
    if(window.confirm('Are you sure you want to delete this template?')) {
        deleteTemplate(templateId);
        toast.success('Template deleted.');
    }
  }
  
  const handleCreateNew = () => {
    const newTemplate = {
        id: `template-${generateId()}`,
        name: 'Untitled Template',
        description: 'A new blank template.',
        pages: [
            { id: `page-${generateId()}`, blocks: [] }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    saveTemplate(newTemplate);
    navigate(`/templates/${newTemplate.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Report Templates</h1>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {template.pages.reduce((acc, page) => acc + page.blocks.length, 0)} blocks on {template.pages.length} page(s)
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleClone(template.id)}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              <Link to={`/templates/${template.id}`}>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;