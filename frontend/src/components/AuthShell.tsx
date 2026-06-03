import type { ReactNode } from 'react';
import { Icon, I } from './ui/Icon';
import { ThemeToggle } from './ui/ThemeToggle';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="auth-shell"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.05fr)',
      }}
    >
      <div
        className="auth-aside"
        style={{
          background:
            'linear-gradient(160deg, var(--accent-strong), oklch(0.34 0.16 var(--accent-h)))',
          color: 'white',
          padding: '48px 52px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            background:
              'radial-gradient(600px 400px at 80% -10%, oklch(1 0 0 / .18), transparent), radial-gradient(500px 500px at -10% 110%, oklch(1 0 0 / .12), transparent)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'oklch(1 0 0 / .16)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon path={I.spark} size={18} fill sw={0} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' }}>
            Heroes
          </span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              marginBottom: 16,
              textWrap: 'balance',
            }}
          >
            Gerencie projetos e equipes em um só lugar.
          </div>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: 'oklch(1 0 0 / .82)',
              maxWidth: 420,
            }}
          >
            Acompanhe o progresso, defina responsáveis e mantenha cada entrega no
            rumo certo — com controle de acesso por papel.
          </p>
          <div style={{ display: 'flex', gap: 22, marginTop: 32 }}>
            {[
              ['8', 'projetos ativos'],
              ['5', 'membros'],
              ['100%', 'rastreável'],
            ].map(([n, l]) => (
              <div key={l}>
                <div
                  style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 12.5, color: 'oklch(1 0 0 / .7)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 12.5,
            color: 'oklch(1 0 0 / .6)',
            fontFamily: 'var(--mono)',
          }}
        >
          protótipo · NestJS + React + PostgreSQL
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 28px',
          background: 'var(--bg)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
          <ThemeToggle />
        </div>
        <div className="fade-in" style={{ width: '100%', maxWidth: 396 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
