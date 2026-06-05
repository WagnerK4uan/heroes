import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getHero } from '../data/heroes';
import { Logo } from './ui/Logo';
import { ThemeToggle } from './ui/ThemeToggle';
import { UserAvatar } from './ui/UserAvatar';
import { HeroBadge } from './ui/HeroBadge';
import { RolePill } from './ui/RolePill';
import { Icon, I } from './ui/Icon';

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) {
    return null;
  }

  const hero = getHero(user.character);
  const firstName = user.name.split(' ')[0];

  function handleLogout() {
    setMenu(false);
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 60,
        background: 'color-mix(in oklch, var(--surface) 86%, transparent)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 clamp(14px, 4vw, 24px)',
      }}
    >
      <a href="#/dashboard" style={{ display: 'flex' }}>
        <Logo size={26} />
      </a>

      <div style={{ flex: 1 }} />

      <ThemeToggle />

      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenu((m) => !m)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: 'none',
            border: '1px solid transparent',
            borderRadius: 999,
            padding: '4px 6px 4px 4px',
          }}
        >
          <UserAvatar user={user} size={32} />
          <div
            className="hide-sm"
            style={{ textAlign: 'left', lineHeight: 1.15, paddingRight: 2 }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              {firstName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              {hero ? hero.name : user.role}
            </div>
          </div>
        </button>

        {menu && (
          <div
            className="fade-in"
            style={{
              position: 'absolute',
              right: 0,
              top: 46,
              width: 248,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              boxShadow: 'var(--shadow-lg)',
              padding: 8,
              zIndex: 50,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '8px 10px 12px',
              }}
            >
              <UserAvatar user={user} size={38} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>

            <div
              style={{ height: 1, background: 'var(--border)', margin: '2px 4px 6px' }}
            />

            <div
              style={{
                padding: '6px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 13,
                color: 'var(--ink-2)',
              }}
            >
              <span>Papel atual</span>
              <RolePill role={user.role} />
            </div>

            {hero && (
              <div
                style={{
                  padding: '4px 10px 8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: 'var(--ink-2)',
                }}
              >
                <span>Herói</span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontWeight: 600,
                  }}
                >
                  <HeroBadge hero={hero} size={20} /> {hero.name}
                </span>
              </div>
            )}

            <button
              onClick={() => {
                setMenu(false);
                navigate('/choose-hero');
              }}
              className="menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: 'none',
                padding: '9px 10px',
                borderRadius: 9,
                color: 'var(--ink-2)',
                fontSize: 13.5,
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <Icon path={I.refresh} size={16} /> Trocar herói
            </button>

            <button
              onClick={handleLogout}
              className="menu-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: 'none',
                padding: '9px 10px',
                borderRadius: 9,
                color: 'var(--ink-2)',
                fontSize: 13.5,
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <Icon path={I.logout} size={16} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
