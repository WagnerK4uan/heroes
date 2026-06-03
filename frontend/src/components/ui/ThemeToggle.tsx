import { useTheme } from '../../theme/ThemeContext';
import { Icon, I } from './Icon';

interface ThemeToggleProps {
  size?: number;
}

export function ThemeToggle({ size = 36 }: ThemeToggleProps) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="btn btn-secondary btn-icon"
      title={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-label="Alternar tema"
      aria-pressed={dark}
      style={{ width: size, height: size, borderRadius: 999, color: 'var(--ink-2)' }}
    >
      <Icon path={dark ? I.sun : I.moon} size={17} fill={!dark} sw={dark ? 1.9 : 0} />
    </button>
  );
}
