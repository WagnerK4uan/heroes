import { api } from './client';

export type ProjectStatus = 'pendente' | 'em_andamento' | 'concluido';

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export const STATUS_OPTIONS: ProjectStatus[] = [
  'pendente',
  'em_andamento',
  'concluido',
];

export const GOAL_FIELDS = [
  { key: 'agilidade', label: 'Agilidade' },
  { key: 'encantamento', label: 'Encantamento' },
  { key: 'eficiencia', label: 'Eficiência' },
  { key: 'excelencia', label: 'Excelência' },
  { key: 'transparencia', label: 'Transparência' },
  { key: 'ambicao', label: 'Ambição' },
] as const;

export type GoalKey = (typeof GOAL_FIELDS)[number]['key'];

export interface ProjectResponsible {
  id: number;
  name: string;
  character: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  agilidade: number;
  encantamento: number;
  eficiencia: number;
  excelencia: number;
  transparencia: number;
  ambicao: number;
  responsibleId: number;
  responsible?: ProjectResponsible;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  responsibleId?: number;
}

export interface ProjectPayload {
  name: string;
  description: string;
  status: ProjectStatus;
  agilidade: number;
  encantamento: number;
  eficiencia: number;
  excelencia: number;
  transparencia: number;
  ambicao: number;
  responsibleId: number;
}

export function completionPercentage(project: Project): number {
  const total = GOAL_FIELDS.reduce(
    (sum, field) => sum + project[field.key],
    0,
  );
  return Math.round(total / GOAL_FIELDS.length);
}

export async function listProjects(
  filters: ProjectFilters = {},
): Promise<Project[]> {
  const params: Record<string, string | number> = {};
  if (filters.status) {
    params.status = filters.status;
  }
  if (filters.responsibleId) {
    params.responsibleId = filters.responsibleId;
  }
  const response = await api.get<Project[]>('/projects', { params });
  return response.data;
}

export async function createProject(
  payload: ProjectPayload,
): Promise<Project> {
  const response = await api.post<Project>('/projects', payload);
  return response.data;
}

export async function updateProject(
  id: number,
  payload: ProjectPayload,
): Promise<Project> {
  const response = await api.patch<Project>(`/projects/${id}`, payload);
  return response.data;
}
