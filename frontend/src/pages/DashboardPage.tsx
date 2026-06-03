import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold">HeroForce</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-600"
        >
          Sair
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="mb-2 text-2xl font-bold">Área interna</h2>
        <p className="mb-6 text-slate-400">
          Você está autenticado. O painel de projetos chega na próxima etapa.
        </p>

        {user && (
          <div className="rounded-2xl bg-slate-800 p-6">
            <h3 className="mb-4 text-lg font-semibold">Sessão atual</h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  ID
                </dt>
                <dd className="text-slate-200">{user.userId}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  E-mail
                </dt>
                <dd className="text-slate-200">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Papel
                </dt>
                <dd className="text-slate-200">{user.role}</dd>
              </div>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}
