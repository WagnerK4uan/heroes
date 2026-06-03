import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';
import { AuthShell } from '../components/AuthShell';
import { Field } from '../components/ui/Field';
import { Icon, I } from '../components/ui/Icon';
import { Spinner } from '../components/ui/Spinner';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export function RegisterPage() {
  const { token, register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Informe seu nome';
    else if (form.name.trim().length < 3) e.name = 'Nome muito curto';
    if (!form.email) e.email = 'Informe seu e-mail';
    else if (!emailRe.test(form.email)) e.email = 'E-mail inválido';
    if (!form.password) e.password = 'Crie uma senha';
    else if (form.password.length < 6) e.password = 'Mínimo de 6 caracteres';
    if (form.confirm !== form.password) e.confirm = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiErr(extractErrorMessage(err, 'Falha ao cadastrar'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
        Criar conta
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 24 }}>
        Comece agora. Novas contas entram com o papel{' '}
        <b style={{ color: 'var(--ink-2)' }}>USER</b>.
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }} noValidate>
        <Field
          label="Nome"
          required
          icon={I.user}
          placeholder="Seu nome completo"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Field
          label="E-mail"
          required
          icon={I.mail}
          type="email"
          placeholder="voce@empresa.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
        <Field
          label="Senha"
          required
          icon={I.lock}
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />
        <Field
          label="Confirmar senha"
          required
          icon={I.lock}
          type="password"
          placeholder="Repita a senha"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
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
              Criando conta…
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      <p style={{ marginTop: 22, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
