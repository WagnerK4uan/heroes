import { Icon, I } from './Icon';

interface LogoProps {
  size?: number;
  withText?: boolean;
}

export function Logo({ size = 26, withText = true }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm), inset 0 0 0 1px oklch(1 0 0 / .18)',
          color: 'white',
        }}
      >
        <Icon path={I.spark} size={size * 0.62} fill sw={0} />
      </div>
      {withText && (
        <span
          style={{
            fontWeight: 800,
            fontSize: size * 0.66,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
          }}
        >
          Heroes
        </span>
      )}
    </div>
  );
}
