import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Icon, I } from './Icon';

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: number;
  msg: string;
  type: ToastType;
}

type ToastFn = (msg: string, type?: ToastType) => void;

const ToastContext = createContext<ToastFn | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastFn>(
    (msg, type = 'info') => {
      const id = nextId.current++;
      setItems((list) => [...list, { id, msg, type }]);
      window.setTimeout(() => dismiss(id), 3400);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="fade-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '11px 16px',
              borderRadius: 10,
              boxShadow: 'var(--shadow-lg)',
              fontSize: 14,
              fontWeight: 500,
              maxWidth: 440,
            }}
          >
            <span
              style={{
                color:
                  t.type === 'error'
                    ? 'oklch(0.7 0.16 25)'
                    : t.type === 'success'
                      ? 'oklch(0.75 0.14 155)'
                      : 'var(--accent-strong)',
                display: 'flex',
              }}
            >
              <Icon
                path={t.type === 'error' ? I.alert : t.type === 'success' ? I.check : I.spark}
                size={17}
                fill={t.type === 'info'}
                sw={t.type === 'info' ? 0 : 2.2}
              />
            </span>
            {t.msg}
            <button
              onClick={() => dismiss(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--faint)',
                display: 'flex',
                padding: 2,
                marginLeft: 4,
              }}
            >
              <Icon path={I.x} size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
}
