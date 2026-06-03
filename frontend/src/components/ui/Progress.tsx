interface ProgressProps {
  value: number;
  done?: boolean;
}

export function Progress({ value, done }: ProgressProps) {
  return (
    <div className={`progress ${done ? 'is-done' : ''}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
