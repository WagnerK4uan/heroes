import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';
import { setMyHero } from '../api/heroes';
import { HEROES } from '../data/heroes';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { HeroBadge } from '../components/ui/HeroBadge';
import { Spinner } from '../components/ui/Spinner';
import { Icon, I } from '../components/ui/Icon';
import { useToast } from '../components/ui/ToastContext';

export function ChooseHeroPage() {
  const { user, setCharacter, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [sel, setSel] = useState<string | null>(user?.character ?? null);
  const [saving, setSaving] = useState(false);
  const changing = !!user?.character;

  async function confirm() {
    if (!sel) return;
    setSaving(true);
    try {
      const updated = await setMyHero(sel);
      setCharacter(updated.character);
      toast('Herói definido com sucesso!', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast(extractErrorMessage(err, 'Não foi possível salvar o herói.'), 'error');
    } finally {
      setSaving(false);
    }
  }

  const firstName = user?.name?.split(' ')[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <header
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Logo size={26} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button
            className="btn btn-ghost btn-sm"
            onClick={logout}
            style={{ color: 'var(--muted)' }}
          >
            <Icon path={I.logout} size={15} /> Sair
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div className="fade-in" style={{ width: '100%', maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--accent-ink)',
                whiteSpace: 'nowrap',
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-soft-bd)',
                padding: '5px 11px',
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              <Icon path={I.shield} size={14} /> {changing ? 'Trocar herói' : 'Quase lá'}
            </div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                marginBottom: 6,
              }}
            >
              {firstName ? `Bem-vindo, ${firstName}!` : 'Escolha seu herói'}
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: 15.5,
                maxWidth: 460,
                margin: '0 auto',
              }}
            >
              Escolha o herói que vai representar você na plataforma. Você pode
              trocar quando quiser.
            </p>
          </div>

          <div className="hero-grid">
            {HEROES.map((h) => {
              const active = sel === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSel(h.id)}
                  className={`hero-card ${active ? 'is-active' : ''}`}
                >
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon path={I.check} size={13} sw={3} />
                    </span>
                  )}
                  <HeroBadge hero={h} size={62} />
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      marginTop: 12,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {h.name}
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11.5,
                      color: 'var(--muted)',
                      fontFamily: 'var(--mono)',
                      marginTop: 4,
                    }}
                  >
                    <Icon path={I.bolt} size={11} fill sw={0} /> {h.trait}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 30 }}>
            {changing && (
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
              >
                Cancelar
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={confirm}
              disabled={!sel || saving}
              style={{ minWidth: 200, height: 44 }}
            >
              {saving ? (
                <>
                  <Spinner />
                  Salvando…
                </>
              ) : (
                <>
                  Confirmar herói <Icon path={I.chevR} size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
