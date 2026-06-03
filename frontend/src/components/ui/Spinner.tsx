import { Icon } from './Icon';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 16 }: SpinnerProps) {
  return (
    <Icon
      className="spin"
      path="M21 12a9 9 0 11-6.2-8.6"
      size={size}
      sw={2.4}
    />
  );
}
