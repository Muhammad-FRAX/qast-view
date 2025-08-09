
export enum BlockType {
  TITLE = 'TITLE',
  KPI = 'KPI',
  CHART = 'CHART',
  TEXT = 'TEXT',
  STATUS = 'STATUS',
  IMAGE = 'IMAGE',
  PROJECT_PROGRESS = 'PROJECT_PROGRESS',
  LIST = 'LIST',
}

export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
}

export enum RiskLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export enum ProjectStatus {
    ON_TRACK = 'On Track',
    AT_RISK = 'At Risk',
    DELAYED = 'Delayed',
    COMPLETED = 'Completed',
}

export interface User {
  id: string;
  username: string;
  // In a real app, this should be a secure hash, not plain text.
  // For this mock implementation, we'll store it directly.
  password_hash: string;
  role: 'admin' | 'user';
  requiresPasswordChange: boolean;
}


interface BaseBlock {
  id: string;
  type: BlockType;
  label: string;
  layout?: {
    colSpan?: number; // 1 to 12
  };
}

export interface TitleBlockData extends BaseBlock {
  type: BlockType.TITLE;
  content: string;
  level: 'h1' | 'h2'; // h1 for header, h2 for section title
  author?: string;
  date?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export interface KpiBlockData extends BaseBlock {
  type: BlockType.KPI;
  value: number;
  unit: string;
  description: string;
  icon?: string;
}

export interface ChartBlockData extends BaseBlock {
  type: BlockType.CHART;
  chartType: ChartType;
  data: { name: string; value: number }[];
}

export interface TextBlockData extends BaseBlock {
  type: BlockType.TEXT;
  content: string; // Markdown supported
}

export interface StatusBlockData extends BaseBlock {
  type: BlockType.STATUS;
  progress: number;
  risk: RiskLevel;
}

export interface ImageBlockData extends BaseBlock {
    type: BlockType.IMAGE;
    src: string;
    alt: string;
}

export interface ProjectProgressItem {
    id: string;
    name: string;
    status: ProjectStatus;
    progress: number;
}

export interface ProjectProgressBlockData extends BaseBlock {
    type: BlockType.PROJECT_PROGRESS;
    projects: ProjectProgressItem[];
}

export interface ListItem {
    id: string;
    content: string;
}

export interface ListBlockData extends BaseBlock {
    type: BlockType.LIST;
    items: ListItem[];
}


export type ReportBlockData = TitleBlockData | KpiBlockData | ChartBlockData | TextBlockData | StatusBlockData | ImageBlockData | ProjectProgressBlockData | ListBlockData;

export interface ReportPage {
    id: string;
    blocks: ReportBlockData[];
}

export interface ReportTemplate {
  id:string;
  name: string;
  description: string;
  pages: ReportPage[];
  createdAt: string;
  updatedAt: string;
  userId?: string; // ID of the user who created it. Undefined for default templates.
}

export interface ReportInstance {
  id: string;
  templateId: string;
  name: string;
  data: Record<string, any>; // blockId -> value
  createdAt: string;
  author: string;
  department: string;
}
