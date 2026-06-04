import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';
import { AuthShell } from '../components/AuthShell';
import { Field } from '../components/ui/Field';
import { Icon, I } from '../components/ui/Icon';
import { Spinner } from '../components/ui/Spinner';
import { RolePill } from '../components/ui/RolePill';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const QUICK_ACCESS = [
  { role: 'admin', name: 'Nick Fury', email: 'nick.fury@heroforce.dev', password: 'senha123' },
  { role: 'hero', name: 'Tony Stark', email: 'tony.stark@heroforce.dev', password: 'senha123' },
];

const SHOW_QUICK_ACCESS = import.meta.env.VITE_SHOW_QUICK_ACCESS === 'true';

export function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  function validate() {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = 'Informe seu e-mail';
    else if (!emailRe.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Informe sua senha';
    else if (password.length < 6) e.password = 'Mínimo de 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(creds: { email: string; password: string }) {
    setApiErr('');
    setLoading(true);
    try {
      await login(creds.email, creds.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiErr(extractErrorMessage(err, 'Falha ao entrar'));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    submit({ email, password });
  }

  function quick(target: { email: string; password: string }) {
    setEmail(target.email);
    setPassword(target.password);
    submit(target);
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
        Entrar
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 24 }}>
        Bem-vindo de volta. Acesse sua conta para continuar.
      </p>

      {apiErr && (
        <div
          className="fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: 'var(--danger-soft)',
            border: '1px solid color-mix(in oklch, var(--danger) 28%, transparent)',
            color: 'var(--danger)',
            padding: '10px 13px',
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <Icon path={I.alert} size={16} />
          {apiErr}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
        <Field
          label="E-mail"
          required
          icon={I.mail}
          type="email"
          placeholder="voce@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          label="Senha"
          required
          icon={I.lock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
          style={{ height: 42, marginTop: 2 }}
        >
          {loading ? (
            <>
              <Spinner />
              Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      {SHOW_QUICK_ACCESS && (
        <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px dashed var(--border-strong)' }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--faint)',
              marginBottom: 10,
            }}
          >
            Acesso rápido — avaliação
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {QUICK_ACCESS.map((acc) => (
              <button
                key={acc.email}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => quick(acc)}
                disabled={loading}
              >
                <RolePill role={acc.role} /> {acc.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      <p style={{ marginTop: 22, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
        Não tem conta?{' '}
        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Cadastre-se
        </Link>
      </p>
    </AuthShell>
  );
}
