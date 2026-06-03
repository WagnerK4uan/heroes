import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../components/ui/ToastContext';

function Loader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--muted)',
      }}
    >
      <Spinner size={22} />
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function RequireHero({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loader />;
  }

  if (!user.character) {
    return <Navigate to="/choose-hero" replace />;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading, user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast('Acesso restrito a administradores.', 'error');
    }
  }, [loading, user, isAdmin, toast]);

  if (loading || !user) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
