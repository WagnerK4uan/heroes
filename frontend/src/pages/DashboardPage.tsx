import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  deleteProject,
  listProjects,
  type Project,
  type ProjectFilters,
  type ProjectResponsible,
  type ProjectStatus,
} from '../api/projects';
import { TopBar } from '../components/TopBar';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDelete } from '../components/ui/ConfirmDelete';
import { Icon, I } from '../components/ui/Icon';
import { useToast } from '../components/ui/ToastContext';

interface ResponsibleOption {
  id: number;
  name: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [responsibleFilter, setResponsibleFilter] = useState('');

  const [seenResponsibles, setSeenResponsibles] = useState<
    Record<number, ProjectResponsible>
  >({});

  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setSeenResponsibles((prev) => {
        const next = { ...prev };
        for (const project of data) {
          if (project.responsible) {
            next[project.responsible.id] = project.responsible;
          }
        }
        return next;
      });
    } catch (err) {
      const message = extractErrorMessage(
        err,
        'Não foi possível carregar os projetos.',
      );
      setError(message);
      toast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, responsibleFilter, toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const responsibleOptions = useMemo<ResponsibleOption[]>(() => {
    const map = new Map<number, ResponsibleOption>();
    for (const responsible of Object.values(seenResponsibles)) {
      map.set(responsible.id, { id: responsible.id, name: responsible.name });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [seenResponsibles]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === 'em_andamento').length,
      done: projects.filter((p) => p.status === 'concluido').length,
    }),
    [projects],
  );

  const hasFilter = Boolean(statusFilter || responsibleFilter);

  function clearFilters() {
    setStatusFilter('');
    setResponsibleFilter('');
  }

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProject(toDelete.id);
      toast(`Projeto "${toDelete.name}" excluído`, 'success');
      setToDelete(null);
      loadProjects();
    } catch (err) {
      toast(
        extractErrorMessage(err, 'Não foi possível excluir o projeto.'),
        'error',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 22,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                marginBottom: 3,
              }}
            >
              Projetos
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>
              {loading ? (
                'Carregando…'
              ) : (
                <>
                  {stats.total} {stats.total === 1 ? 'projeto' : 'projetos'} ·{' '}
                  {stats.active} em andamento · {stats.done} concluído
                  {stats.done === 1 ? '' : 's'}
                </>
              )}
            </p>
          </div>

          {isAdmin ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              <Icon path={I.plus} size={17} /> Novo projeto
            </button>
          ) : (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12.5,
                color: 'var(--muted)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '7px 11px',
              }}
            >
              <Icon path={I.lock} size={13} /> Somente leitura · papel USER
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--muted)',
              marginRight: 2,
            }}
          >
            <Icon path={I.filter} size={14} /> Filtros
          </span>

          <FilterSelect
            icon={I.grid}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as ProjectStatus | '')}
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            icon={I.user}
            value={responsibleFilter}
            onChange={setResponsibleFilter}
            width={200}
          >
            <option value="">Todos os responsáveis</option>
            {responsibleOptions.map((responsible) => (
              <option key={responsible.id} value={responsible.id}>
                {responsible.name}
              </option>
            ))}
          </FilterSelect>

          {hasFilter && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <Icon path={I.x} size={14} /> Limpar
            </button>
          )}
        </div>

        {loading ? (
          <div className="proj-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 224,
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div className="shimmer" />
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={I.alert}
            title="Não foi possível carregar"
            body={error}
            action={
              <button className="btn btn-secondary" onClick={loadProjects}>
                Tentar novamente
              </button>
            }
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={I.folder}
            title={hasFilter ? 'Nenhum projeto encontrado' : 'Ainda não há projetos'}
            body={
              hasFilter
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : isAdmin
                  ? 'Crie o primeiro projeto para começar a acompanhar o progresso.'
                  : 'Quando houver projetos, eles aparecerão aqui.'
            }
            action={
              hasFilter ? (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Limpar filtros
                </button>
              ) : isAdmin ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/projects/new')}
                >
                  <Icon path={I.plus} size={16} /> Novo projeto
                </button>
              ) : null
            }
          />
        ) : (
          <div className="proj-grid fade-in">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onEdit={(p) => navigate(`/projects/${p.id}/edit`)}
                onDelete={(p) => setToDelete(p)}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmDelete
        project={toDelete}
        busy={deleting}
        onCancel={() => !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

interface FilterSelectProps {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  width?: number;
}

function FilterSelect({
  icon,
  value,
  onChange,
  children,
  width,
}: FilterSelectProps) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          position: 'absolute',
          left: 11,
          color: 'var(--muted)',
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        <Icon path={icon} size={15} />
      </span>
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          paddingLeft: 33,
          height: 38,
          fontSize: 13.5,
          fontWeight: 500,
          minWidth: width ?? 180,
          color: value ? 'var(--ink)' : 'var(--muted)',
        }}
      >
        {children}
      </select>
    </div>
  );
}
