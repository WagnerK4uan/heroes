import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractErrorMessage } from '../api/client';
import {
  GOAL_FIELDS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  createProject,
  getProject,
  updateProject,
  type GoalKey,
  type ProjectPayload,
  type ProjectStatus,
} from '../api/projects';
import { listHeroes, type Hero } from '../api/heroes';
import { TopBar } from '../components/TopBar';
import { Field } from '../components/ui/Field';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Icon, I } from '../components/ui/Icon';
import { useToast } from '../components/ui/ToastContext';

interface ProjectFormPageProps {
  mode: 'create' | 'edit';
}

type GoalValues = Record<GoalKey, number>;

interface FormErrors {
  name?: string;
  description?: string;
  responsibleId?: string;
}

function emptyGoals(): GoalValues {
  return GOAL_FIELDS.reduce(
    (acc, field) => ({ ...acc, [field.key]: 0 }),
    {} as GoalValues,
  );
}

function clampGoal(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export function ProjectFormPage({ mode }: ProjectFormPageProps) {
  const editing = mode === 'edit';
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const id = editing ? Number(params.id) : null;

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('pendente');
  const [responsibleId, setResponsibleId] = useState('');
  const [goals, setGoals] = useState<GoalValues>(emptyGoals);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const list = await listHeroes();
        if (!active) {
          return;
        }
        setHeroes(list);
        if (editing && id) {
          const project = await getProject(id);
          if (!active) {
            return;
          }
          setName(project.name);
          setDescription(project.description);
          setStatus(project.status);
          setResponsibleId(String(project.responsibleId));
          setGoals(
            GOAL_FIELDS.reduce(
              (acc, field) => ({ ...acc, [field.key]: project[field.key] }),
              {} as GoalValues,
            ),
          );
        } else if (list.length) {
          setResponsibleId(String(list[0].id));
        }
      } catch (err) {
        if (!active) {
          return;
        }
        if (editing) {
          setNotFound(true);
        } else {
          toast(
            extractErrorMessage(err, 'Não foi possível carregar os dados.'),
            'error',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [editing, id, toast]);

  const average = useMemo(() => {
    const total = GOAL_FIELDS.reduce((sum, field) => sum + goals[field.key], 0);
    return Math.round(total / GOAL_FIELDS.length);
  }, [goals]);

  function setGoal(key: GoalKey, value: string) {
    setGoals((prev) => ({ ...prev, [key]: clampGoal(value) }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) {
      next.name = 'Informe o nome do projeto';
    } else if (name.trim().length < 3) {
      next.name = 'Nome muito curto';
    }
    if (!description.trim()) {
      next.description = 'Informe uma descrição';
    }
    if (!responsibleId) {
      next.responsibleId = 'Selecione um responsável';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSaving(true);
    const payload: ProjectPayload = {
      name: name.trim(),
      description: description.trim(),
      status,
      responsibleId: Number(responsibleId),
      ...GOAL_FIELDS.reduce(
        (acc, field) => ({ ...acc, [field.key]: goals[field.key] }),
        {} as GoalValues,
      ),
    };
    try {
      if (editing && id) {
        await updateProject(id, payload);
        toast('Projeto atualizado com sucesso', 'success');
      } else {
        await createProject(payload);
        toast('Projeto criado com sucesso', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      toast(
        extractErrorMessage(err, 'Não foi possível salvar o projeto.'),
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar />

      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 'clamp(18px, 5vw, 26px) clamp(16px, 5vw, 24px) 80px',
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/dashboard')}
          style={{ marginLeft: -10, marginBottom: 14, color: 'var(--muted)' }}
        >
          <Icon path={I.arrowL} size={16} /> Voltar para projetos
        </button>

        {notFound ? (
          <EmptyState
            icon={I.alert}
            title="Projeto não encontrado"
            body="O projeto que você tentou abrir não existe ou foi removido."
            action={
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Voltar ao dashboard
              </button>
            }
          />
        ) : (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  fontSize: 'clamp(21px, 5.5vw, 25px)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  marginBottom: 4,
                }}
              >
                {editing ? 'Editar projeto' : 'Novo projeto'}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>
                {editing
                  ? 'Atualize as informações e salve as alterações.'
                  : 'Preencha os campos para registrar um novo projeto.'}
              </p>
            </div>

            {loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'var(--muted)',
                  padding: '40px 0',
                  justifyContent: 'center',
                }}
              >
                <Spinner size={20} /> Carregando…
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(16px, 4vw, 26px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Field
                  label="Nome do projeto"
                  required
                  error={errors.name}
                  placeholder="Ex.: Portal do Cliente 2.0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="field">
                  <label className="label">
                    Descrição<span className="req">*</span>
                  </label>
                  <textarea
                    className={`textarea ${errors.description ? 'input-err' : ''}`}
                    placeholder="Descreva o objetivo e o escopo do projeto…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && (
                    <span className="err-msg">
                      <Icon path={I.alert} size={13} />
                      {errors.description}
                    </span>
                  )}
                </div>

                <div
                  className="form-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
                  <div className="field">
                    <label className="label">
                      Status<span className="req">*</span>
                    </label>
                    <select
                      className="select"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as ProjectStatus)
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {STATUS_LABELS[option]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">
                      Responsável<span className="req">*</span>
                    </label>
                    <select
                      className={`select ${errors.responsibleId ? 'input-err' : ''}`}
                      value={responsibleId}
                      onChange={(e) => setResponsibleId(e.target.value)}
                    >
                      <option value="" disabled>
                        Selecione…
                      </option>
                      {heroes.map((hero) => (
                        <option key={hero.id} value={hero.id}>
                          {hero.name}
                          {hero.role === 'admin' ? ' · admin' : ''}
                        </option>
                      ))}
                    </select>
                    {errors.responsibleId && (
                      <span className="err-msg">
                        <Icon path={I.alert} size={13} />
                        {errors.responsibleId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label
                    className="label"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Metas do projeto</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--mono)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--accent-ink)',
                      }}
                    >
                      Média {average}%
                    </span>
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      marginTop: 2,
                    }}
                  >
                    {GOAL_FIELDS.map((field) => {
                      const value = goals[field.key];
                      return (
                        <div key={field.key}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 7,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--ink-2)',
                              }}
                            >
                              {field.label}
                            </span>
                            <input
                              className="input"
                              type="number"
                              min={0}
                              max={100}
                              value={value}
                              onChange={(e) => setGoal(field.key, e.target.value)}
                              style={{
                                width: 76,
                                padding: '6px 8px',
                                fontSize: 13,
                                textAlign: 'center',
                              }}
                            />
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={value}
                            onChange={(e) => setGoal(field.key, e.target.value)}
                            className="range"
                            style={
                              { '--rfill': `${value}%` } as React.CSSProperties
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'flex-end',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 18,
                    marginTop: 2,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ minWidth: 140 }}
                  >
                    {saving ? (
                      <>
                        <Spinner />
                        Salvando…
                      </>
                    ) : editing ? (
                      <>
                        <Icon path={I.check} size={17} />
                        Salvar alterações
                      </>
                    ) : (
                      <>
                        <Icon path={I.plus} size={17} />
                        Criar projeto
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
