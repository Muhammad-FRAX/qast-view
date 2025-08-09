
import { ReportTemplate, ReportInstance, BlockType, ChartType, RiskLevel, ProjectStatus, User } from '@/types';

// In a real app, passwords would be hashed. For this mock, we store them directly.
export const initialUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    password_hash: 'Welcome@123',
    role: 'admin',
    requiresPasswordChange: false,
  },
  {
    id: 'user-2',
    username: 'testuser',
    password_hash: 'password',
    role: 'user',
    requiresPasswordChange: true,
  },
];


export const initialTemplates: ReportTemplate[] = [
  {
    id: 'template-1',
    name: 'Monthly Financial Review',
    description: 'A standard template for monthly financial reporting.',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-26T14:00:00Z',
    // No userId means it's a default template visible to all
    pages: [
      {
        id: 'page-1',
        blocks: [
          { 
            id: 'block-1-1', 
            type: BlockType.TITLE, 
            level: 'h1',
            label: 'Report Header', 
            content: 'Monthly Financial Review', 
            author: 'Finance Team', 
            date: '2023-10-26T14:00:00Z',
            logoSrc: 'https://picsum.photos/seed/qastviewlogo/150/50',
            logoAlt: 'Company Logo',
            layout: { colSpan: 12 } 
          },
          { id: 'block-1-7', type: BlockType.TEXT, label: 'Executive Summary', content: 'Overall performance this month was strong, exceeding targets by 15%. Key growth was observed in the North American market, while the new product line in APAC shows promising early results.', layout: { colSpan: 12 } },
          { id: 'block-1-3', type: BlockType.KPI, label: 'Total Revenue', value: 1250000, unit: 'USD', description: '+12% from last month', icon: 'DollarSign', layout: { colSpan: 4 } },
          { id: 'block-1-4', type: BlockType.KPI, label: 'Net Profit', value: 350000, unit: 'USD', description: '28% Margin', icon: 'TrendingUp', layout: { colSpan: 4 } },
          { id: 'block-1-x', type: BlockType.KPI, label: 'New Customers', value: 840, unit: 'Customers', description: 'Exceeded goal of 800', icon: 'Users', layout: { colSpan: 4 } },
          { id: 'block-1-6', type: BlockType.CHART, label: 'Revenue by Region', chartType: ChartType.BAR, data: [ { name: 'NA', value: 400 }, { name: 'EU', value: 300 }, { name: 'APAC', value: 200 }, { name: 'LATAM', value: 100 } ], layout: { colSpan: 8 }},
          { id: 'block-1-5', type: BlockType.STATUS, label: 'Project Phoenix Status', progress: 75, risk: RiskLevel.MEDIUM, layout: { colSpan: 4 } },
        ]
      }
    ],
  },
  {
    id: 'template-3',
    name: 'Weekly Infographic Report',
    description: 'A comprehensive weekly status report with metrics, progress, and priorities.',
    createdAt: '2023-11-10T12:00:00Z',
    updatedAt: '2023-11-10T12:00:00Z',
    // No userId means it's a default template
    pages: [
      {
        id: 'page-3-1',
        blocks: [
          {
            id: 'block-3-1', type: BlockType.TITLE, level: 'h1', label: 'Report Header',
            content: 'Weekly Status Report', author: 'Team Lead', date: new Date().toISOString(),
            logoSrc: 'https://i.imgur.com/1AkSihE.png', layout: { colSpan: 12 }
          },
          {
            id: 'block-3-2', type: BlockType.TITLE, level: 'h2', label: 'Section Title',
            content: 'Executive Briefing', layout: { colSpan: 12 }
          },
          {
            id: 'block-3-3', type: BlockType.TEXT, label: 'Top Accomplishment',
            content: '', layout: { colSpan: 12 }
          },
          {
            id: 'block-3-4', type: BlockType.TEXT, label: 'Key Challenge & Action',
            content: '', layout: { colSpan: 12 }
          },
          {
            id: 'block-3-5', type: BlockType.TITLE, level: 'h2', label: 'Section Title',
            content: 'Performance Metrics', layout: { colSpan: 12 }
          },
          { id: 'block-3-6', type: BlockType.KPI, label: 'System Uptime', value: 99.9, unit: '%', description: 'OSS Performance', icon: 'ShieldCheck', layout: { colSpan: 4 } },
          { id: 'block-3-7', type: BlockType.KPI, label: 'Critical Incidents', value: 2, unit: '', description: 'OSS Performance', icon: 'AlertTriangle', layout: { colSpan: 4 } },
          { id: 'block-3-8', type: BlockType.KPI, label: 'MTTR', value: 4, unit: 'hours', description: 'OSS Performance', icon: 'Clock', layout: { colSpan: 4 } },
          { id: 'block-3-9', type: BlockType.KPI, label: 'BI Dashboard Usage', value: 85, unit: '%', description: 'Business Intelligence', icon: 'Users', layout: { colSpan: 4 } },
          { id: 'block-3-10', type: BlockType.KPI, label: 'Data Quality Score', value: 92, unit: '%', description: 'Business Intelligence', icon: 'Database', layout: { colSpan: 4 } },
          { id: 'block-3-11', type: BlockType.KPI, label: 'Reports Generated', value: 150, unit: '', description: 'Business Intelligence', icon: 'FileText', layout: { colSpan: 4 } },
          {
            id: 'block-3-12', type: BlockType.TITLE, level: 'h2', label: 'Section Title',
            content: 'Project & Initiative Progress', layout: { colSpan: 12 }
          },
          {
            id: 'block-3-13', type: BlockType.PROJECT_PROGRESS, label: 'Projects',
            projects: [
                { id: 'p1', name: 'Project Alpha', status: ProjectStatus.ON_TRACK, progress: 75 },
                { id: 'p2', name: 'Project Bravo', status: ProjectStatus.AT_RISK, progress: 40 },
                { id: 'p3', name: 'Project Charlie', status: ProjectStatus.DELAYED, progress: 20 },
            ],
            layout: { colSpan: 12 }
          },
           {
            id: 'block-3-14', type: BlockType.LIST, label: 'Business Impact & Value',
            items: [ {id: 'i1', content: 'Statement 1'}, {id: 'i2', content: 'Statement 2'}, {id: 'i3', content: 'Statement 3'}],
            layout: { colSpan: 6 }
          },
          {
            id: 'block-3-15', type: BlockType.LIST, label: 'Priorities For Next Week',
            items: [{id: 'pr1', content: 'Priority 1'}, {id: 'pr2', content: 'Priority 2'}, {id: 'pr3', content: 'Priority 3'}],
            layout: { colSpan: 6 }
          }
        ]
      }
    ]
  },
  {
    id: 'template-2',
    name: 'Weekly Project Update',
    description: 'A concise report for weekly project status updates.',
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-10-20T11:00:00Z',
    // No userId means it's a default template visible to all
    pages: [
        {
            id: 'page-2',
            blocks: [
                { 
                  id: 'block-2-1', 
                  type: BlockType.TITLE, 
                  level: 'h1',
                  label: 'Project Header', 
                  content: 'Project Titan - Weekly Update', 
                  author: 'John Doe',
                  date: '2023-10-20T11:00:00Z',
                  layout: { colSpan: 12 } 
                },
                { id: 'block-2-2', type: BlockType.STATUS, label: 'Overall Progress', progress: 40, risk: RiskLevel.LOW, layout: { colSpan: 12 } },
                {
                  id: 'block-2-5',
                  type: BlockType.TITLE,
                  level: 'h2',
                  label: 'Section Title',
                  content: 'Key Updates',
                  layout: { colSpan: 12 }
                },
                { id: 'block-2-3', type: BlockType.TEXT, label: 'Key Accomplishments', content: ' - Deployed staging server\n - Completed UI mockups for dashboard', layout: { colSpan: 6 } },
                { id: 'block-2-4', type: BlockType.TEXT, label: 'Next Week Priorities', content: ' - Begin backend integration\n - User testing session', layout: { colSpan: 6 } },
            ]
        }
    ],
  },
];


export const initialReports: ReportInstance[] = [
    {
        id: '1',
        templateId: 'template-1',
        name: 'October 2023 Financials',
        createdAt: '2023-11-01T09:00:00Z',
        author: 'Alice Johnson',
        department: 'Finance',
        data: {
            'block-1-1': { 
              content: 'October 2023 Financials', 
              author: 'Alice Johnson',
              date: '2023-11-01T09:00:00Z',
              logoSrc: 'https://picsum.photos/seed/qastviewlogo2/150/50',
            },
            'block-1-3': { value: 1350000 },
            'block-1-4': { value: 420000 },
            'block-1-x': { value: 910 },
            'block-1-5': { progress: 85, risk: RiskLevel.LOW },
            'block-1-6': { data: [ { name: 'NA', value: 450 }, { name: 'EU', value: 350 }, { name: 'APAC', value: 220 }, { name: 'LATAM', value: 130 } ] },
            'block-1-7': { content: 'October performance was outstanding, driven by new product launches. All regions reported growth.'}
        },
    }
];

// In a real app, these hooks would use fetch to talk to a backend.
// For this prototype, we'll interact with the AppContext.
// The useAppContext hook provides the actual functions.
// This file is now primarily for initial data.