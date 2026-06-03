import { useEffect, useState, type FormEvent } from 'react';
import { extractErrorMessage } from '../api/client';
import {
  GOAL_FIELDS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  createProject,
  updateProject,
  type GoalKey,
  type Project,
  type ProjectPayload,
  type ProjectStatus,
} from '../api/projects';
import type { Hero } from '../api/heroes';

interface ProjectFormModalProps {
  project: Project | null;
  heroes: Hero[];
  onClose: () => void;
  onSaved: () => void;
}

type GoalState = Record<GoalKey, number>;

function buildGoalState(project: Project | null): GoalState {
  return GOAL_FIELDS.reduce((state, field) => {
    state[field.key] = project ? project[field.key] : 0;
    return state;
  }, {} as GoalState);
}

export function ProjectFormModal({
  project,
  heroes,
  onClose,
  onSaved,
}: ProjectFormModalProps) {
  const isEditing = Boolean(project);

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? 'pendente',
  );
  const [responsibleId, setResponsibleId] = useState<string>(
    project ? String(project.responsibleId) : '',
  );
  const [goals, setGoals] = useState<GoalState>(() => buildGoalState(project));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(project?.name ?? '');
    setDescription(project?.description ?? '');
    setStatus(project?.status ?? 'pendente');
    setResponsibleId(project ? String(project.responsibleId) : '');
    setGoals(buildGoalState(project));
    setError(null);
  }, [project]);

  function updateGoal(key: GoalKey, value: number) {
    const clamped = Math.max(0, Math.min(100, value));
    setGoals((prev) => ({ ...prev, [key]: clamped }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!responsibleId) {
      setError('Selecione o herói responsável.');
      return;
    }

    const payload: ProjectPayload = {
      name: name.trim(),
      description: description.trim(),
      status,
      responsibleId: Number(responsibleId),
      ...goals,
    };

    setSubmitting(true);
    try {
      if (project) {
        await updateProject(project.id, payload);
      } else {
        await createProject(payload);
      }
      onSaved();
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível salvar o projeto.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-800 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            {isEditing ? 'Editar projeto' : 'Novo projeto'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-700 hover:text-slate-100"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Nome
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              minLength={2}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ProjectStatus)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {STATUS_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Responsável
              </label>
              <select
                value={responsibleId}
                onChange={(event) => setResponsibleId(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
              >
                <option value="" disabled>
                  Selecione um herói
                </option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} — {hero.character}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Metas (0 a 100)
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GOAL_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs text-slate-400">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={goals[field.key]}
                    onChange={(event) =>
                      updateGoal(field.key, Number(event.target.value))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
