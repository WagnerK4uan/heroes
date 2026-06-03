import { api } from './client';

export interface Hero {
  id: number;
  name: string;
  email: string;
  character: string;
  role: string;
}

export async function listHeroes(): Promise<Hero[]> {
  const response = await api.get<Hero[]>('/users');
  return response.data;
}
