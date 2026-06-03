import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';
import { listHeroes, type Hero } from '../api/heroes';
import {
  GOAL_FIELDS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  completionPercentage,
  listProjects,
  type Project,
  type ProjectFilters,
  type ProjectResponsible,
  type ProjectStatus,
} from '../api/projects';
import { ProjectFormModal } from '../components/ProjectFormModal';

const STATUS_BADGE: Record<ProjectStatus, string> = {
  pendente: 'bg-amber-500/15 text-amber-300',
  em_andamento: 'bg-sky-500/15 text-sky-300',
  concluido: 'bg-emerald-500/15 text-emerald-300',
};

interface FilterHero {
  id: number;
  name: string;
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [responsibleFilter, setResponsibleFilter] = useState<string>('');

  const [seenHeroes, setSeenHeroes] = useState<Record<number, ProjectResponsible>>(
    {},
  );
  const [adminHeroes, setAdminHeroes] = useState<Hero[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filters: ProjectFilters = {};
    if (statusFilter) {
      filters.status = statusFilter;
    }
    if (responsibleFilter) {
      filters.responsibleId = Number(responsibleFilter);
    }
    try {
      const data = await listProjects(filters);
      setProjects(data);
      setSeenHeroes((prev) => {
        const next = { ...prev };
        for (const project of data) {
          if (project.responsible) {
            next[project.responsible.id] = project.responsible;
          }
        }
        return next;
      });
    } catch (err) {
      setError(
        extractErrorMessage(err, 'Não foi possível carregar os projetos.'),
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, responsibleFilter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    let active = true;
    listHeroes()
      .then((data) => {
        if (active) {
          setAdminHeroes(data);
        }
      })
      .catch(() => {
        if (active) {
          setAdminHeroes([]);
        }
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const filterHeroes = useMemo<FilterHero[]>(() => {
    const map = new Map<number, FilterHero>();
    for (const hero of Object.values(seenHeroes)) {
      map.set(hero.id, { id: hero.id, name: hero.name });
    }
    for (const hero of adminHeroes) {
      map.set(hero.id, { id: hero.id, name: hero.name });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [seenHeroes, adminHeroes]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setFormOpen(true);
  }

  function handleSaved() {
    setFormOpen(false);
    setEditing(null);
    loadProjects();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex flex-col gap-3 border-b border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">HeroForce</h1>
          {user && (
            <p className="text-sm text-slate-400">
              {user.email} · {user.role}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Novo projeto
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-600"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ProjectStatus | '')
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 sm:w-56"
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Responsável
            </label>
            <select
              value={responsibleFilter}
              onChange={(event) => setResponsibleFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 sm:w-56"
            >
              <option value="">Todos os heróis</option>
              {filterHeroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </div>

          {(statusFilter || responsibleFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setResponsibleFilter('');
              }}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {loading && <p className="text-slate-400">Carregando projetos...</p>}

        {!loading && error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="rounded-2xl bg-slate-800 px-4 py-8 text-center text-slate-400">
            Nenhum projeto encontrado.
          </p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const percent = completionPercentage(project);
              return (
                <article
                  key={project.id}
                  className="flex flex-col rounded-2xl bg-slate-800 p-5"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {project.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[project.status]}`}
                    >
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-slate-400">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Conclusão</span>
                      <span className="font-semibold text-slate-200">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {GOAL_FIELDS.map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between"
                      >
                        <dt className="text-slate-400">{field.label}</dt>
                        <dd className="font-medium text-slate-200">
                          {project[field.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-700 pt-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Responsável
                      </p>
                      <p className="text-sm text-slate-200">
                        {project.responsible
                          ? `${project.responsible.name} · ${project.responsible.character}`
                          : `#${project.responsibleId}`}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => openEdit(project)}
                        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {isAdmin && formOpen && (
        <ProjectFormModal
          project={editing}
          heroes={adminHeroes}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
