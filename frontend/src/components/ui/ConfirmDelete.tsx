import { useEffect } from 'react';
import { Icon, I } from './Icon';
import { Spinner } from './Spinner';

interface ConfirmDeleteProps {
  project: { name: string } | null;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}

export function ConfirmDelete({
  project,
  onCancel,
  onConfirm,
  busy,
}: ConfirmDeleteProps) {
  useEffect(() => {
    if (!project) {
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) {
        onCancel();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, busy, onCancel]);

  if (!project) {
    return null;
  }

  return (
    <div
      onMouseDown={() => !busy && onCancel()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'oklch(0.2 0.02 280 / .45)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        className="fade-in"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--surface)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--danger-soft)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Icon path={I.trash} size={21} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Excluir projeto
        </h3>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 22 }}>
          Tem certeza que deseja excluir{' '}
          <b style={{ color: 'var(--ink)' }}>{project.name}</b>? Esta ação não pode ser
          desfeita.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary btn-block"
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            className="btn btn-block"
            onClick={onConfirm}
            disabled={busy}
            style={{ background: 'var(--danger)', color: 'white' }}
          >
            {busy ? (
              <>
                <Spinner />
                Excluindo…
              </>
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
