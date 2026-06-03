interface RolePillProps {
  role: string;
}

export function RolePill({ role }: RolePillProps) {
  const isAdmin = role === 'admin';
  return (
    <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-user'}`}>
      {isAdmin ? 'ADMIN' : 'USER'}
    </span>
  );
}
