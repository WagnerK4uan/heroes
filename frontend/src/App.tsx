import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChooseHeroPage } from './pages/ChooseHeroPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { RequireAuth, RequireHero, RequireAdmin } from './auth/guards';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/choose-hero"
        element={
          <RequireAuth>
            <ChooseHeroPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireHero>
              <DashboardPage />
            </RequireHero>
          </RequireAuth>
        }
      />
      <Route
        path="/projects/new"
        element={
          <RequireAuth>
            <RequireHero>
              <RequireAdmin>
                <ProjectFormPage mode="create" />
              </RequireAdmin>
            </RequireHero>
          </RequireAuth>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <RequireAuth>
            <RequireHero>
              <RequireAdmin>
                <ProjectFormPage mode="edit" />
              </RequireAdmin>
            </RequireHero>
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
