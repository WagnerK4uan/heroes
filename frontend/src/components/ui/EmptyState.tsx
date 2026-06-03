import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          marginBottom: 8,
        }}
      >
        <Icon path={icon} size={26} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{title}</div>
      <div style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 340 }}>{body}</div>
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}
