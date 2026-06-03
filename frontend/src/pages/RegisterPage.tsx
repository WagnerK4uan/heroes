import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { extractErrorMessage } from '../api/client';

export function RegisterPage() {
  const { token, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [character, setCharacter] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password, character });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível concluir o cadastro.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl">
        <h1 className="mb-1 text-3xl font-bold text-white">Criar conta</h1>
        <p className="mb-6 text-sm text-slate-400">
          Cadastre-se e escolha seu personagem.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-slate-300">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-slate-300"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="character"
              className="mb-1 block text-sm text-slate-300"
            >
              Personagem
            </label>
            <input
              id="character"
              type="text"
              required
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="Ex.: Homem-Aranha, Batman..."
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-500 py-2 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
