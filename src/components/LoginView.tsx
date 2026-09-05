import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface LoginViewProps {
  onGoRegister: () => void;
}

const LABEL = 'mb-0 mt-1.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#52525b]';
const INPUT =
  'rounded-lg border border-[#e4e4e7] bg-white px-[14px] py-[11px] font-sans text-sm text-black focus:border-black focus:outline-none';

export function LoginView({ onGoRegister }: LoginViewProps) {
  const { login, users } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    const user = users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
    navigate(user?.role === 'ADMINISTRADOR' ? '/admin' : '/app/tiendas', { replace: true });
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="m-0 text-[22px] font-bold text-black">Iniciar sesión</h1>
      <p className="m-0 mb-3 text-[13px] text-[#52525b]">Accede a tu panel de Mercatus.</p>

      {error && (
        <div className="mb-1 rounded-lg border border-[#e4e4e7] bg-[#fbfbf5] px-3 py-2.5 text-[13px] text-[#52525b]">
          {error}
        </div>
      )}

      <label className={LABEL} htmlFor="login-email">Correo</label>
      <input
        id="login-email"
        className={INPUT}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        autoComplete="email"
      />

      <label className={LABEL} htmlFor="login-password">Contraseña</label>
      <input
        id="login-password"
        className={INPUT}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <button
        className="mt-[18px] cursor-pointer rounded-full border-none bg-black p-[11px] text-sm font-semibold text-white transition-colors hover:bg-[#3f3f46]"
        type="submit"
      >
        Entrar
      </button>

      <p className="mt-4 text-center text-[13px] text-[#52525b]">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-black hover:underline"
          onClick={onGoRegister}
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
