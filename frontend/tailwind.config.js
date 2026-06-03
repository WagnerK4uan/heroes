/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        border: 'var(--border)',
        borderStrong: 'var(--border-strong)',
        ink: 'var(--ink)',
        ink2: 'var(--ink-2)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        accent: 'var(--accent)',
        accentStrong: 'var(--accent-strong)',
        accentSoft: 'var(--accent-soft)',
        accentInk: 'var(--accent-ink)',
        danger: 'var(--danger)',
        dangerSoft: 'var(--danger-soft)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        ui: 'var(--ui)',
        mono: 'var(--mono)',
      },
    },
  },
  plugins: [],
};
