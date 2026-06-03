import { STATUS_LABELS } from '../../api/projects';
import type { ProjectStatus } from '../../api/projects';

const STATUS_CLASS: Record<ProjectStatus, string> = {
  pendente: 'badge-pending',
  em_andamento: 'badge-progress',
  concluido: 'badge-done',
};

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${STATUS_CLASS[status]}`}>
      <span className="dot" />
      {STATUS_LABELS[status]}
    </span>
  );
}
