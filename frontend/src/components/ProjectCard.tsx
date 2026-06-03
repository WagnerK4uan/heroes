import { completionPercentage, type Project } from '../api/projects';
import { StatusBadge } from './ui/StatusBadge';
import { Progress } from './ui/Progress';
import { UserAvatar } from './ui/UserAvatar';
import { Icon, I } from './ui/Icon';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({
  project,
  isAdmin,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const done = project.status === 'concluido';
  const percent = completionPercentage(project);
  const responsibleName = project.responsible?.name ?? `#${project.responsibleId}`;

  return (
    <div
      className="proj-card"
      style={{
        padding: '18px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <StatusBadge status={project.status} />
        {isAdmin && (
          <div className="card-actions" style={{ display: 'flex', gap: 4 }}>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              title="Editar"
              onClick={() => onEdit(project)}
              style={{ width: 30, height: 30 }}
            >
              <Icon path={I.edit} size={15} />
            </button>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              title="Excluir"
              onClick={() => onDelete(project)}
              style={{ width: 30, height: 30, color: 'var(--danger)' }}
            >
              <Icon path={I.trash} size={15} />
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: 16.5,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            lineHeight: 1.25,
            textWrap: 'balance',
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontSize: 13.5,
            color: 'var(--muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)' }}>
            Conclusão
          </span>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 13,
              fontWeight: 600,
              color: done ? 'var(--st-done-ink)' : 'var(--accent-ink)',
            }}
          >
            {percent}%
          </span>
        </div>
        <Progress value={percent} done={done} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          borderTop: '1px solid var(--border)',
          paddingTop: 13,
        }}
      >
        <UserAvatar user={project.responsible} size={26} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {responsibleName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--faint)' }}>Responsável</div>
        </div>
      </div>
    </div>
  );
}
