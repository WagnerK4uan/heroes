import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon, I } from './Icon';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Field({
  label,
  required,
  error,
  hint,
  icon,
  type = 'text',
  children,
  ...props
}: FieldProps) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  const inputType = isPw ? (show ? 'text' : 'password') : type;

  return (
    <div className="field">
      {label && (
        <label className="label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 11,
              color: 'var(--faint)',
              pointerEvents: 'none',
            }}
          >
            <Icon path={icon} size={16} />
          </span>
        )}
        {children || (
          <input
            className={`input ${error ? 'input-err' : ''}`}
            type={inputType}
            style={{
              paddingLeft: icon ? 36 : undefined,
              paddingRight: isPw ? 40 : undefined,
            }}
            {...props}
          />
        )}
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            style={{
              position: 'absolute',
              right: 8,
              background: 'none',
              border: 'none',
              color: 'var(--faint)',
              padding: 4,
              display: 'flex',
            }}
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Icon path={show ? I.eyeOff : I.eye} size={17} />
          </button>
        )}
      </div>
      {error ? (
        <span className="err-msg">
          <Icon path={I.alert} size={13} />
          {error}
        </span>
      ) : hint ? (
        <span className="hint">{hint}</span>
      ) : null}
    </div>
  );
}
