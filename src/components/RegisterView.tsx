import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface RegisterViewProps {
  onGoLogin: () => void;
}

const LABEL = 'mb-0 mt-1.5 text-xs font-semibold uppercase tracking-[0.4px] text-[#52525b]';
const INPUT =
  'rounded-lg border border-[#e4e4e7] bg-white px-[14px] py-[11px] font-sans text-sm text-black focus:border-black focus:outline-none';

export function RegisterView({ onGoLogin }: RegisterViewProps) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    const res = register({ name, email, password, role: 'PROPIETARIO' });
    if (!res.ok) {
      setError(res.error ?? 'No se pudo completar el registro.');
      return;
    }
    navigate('/app', { replace: true });
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="m-0 text-[22px] font-bold text-black">Crear cuenta</h1>
      <p className="m-0 mb-3 text-[13px] text-[#52525b]">Regístrate como Propietario de Tienda para crear y gestionar tus tiendas.</p>

      {error && (
        <div className="mb-1 rounded-lg border border-[#e4e4e7] bg-[#fbfbf5] px-3 py-2.5 text-[13px] text-[#52525b]">
          {error}
        </div>
      )}

      <label className={LABEL} htmlFor="reg-name">Nombre completo</label>
      <input
        id="reg-name"
        className={INPUT}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej. Ana Torres"
        autoComplete="name"
      />

      <label className={LABEL} htmlFor="reg-email">Correo</label>
      <input
        id="reg-email"
        className={INPUT}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        autoComplete="email"
      />

      <label className={LABEL} htmlFor="reg-password">Contraseña</label>
      <input
        id="reg-password"
        className={INPUT}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 6 caracteres"
        autoComplete="new-password"
      />

      <label className={LABEL} htmlFor="reg-confirm">Confirmar contraseña</label>
      <input
        id="reg-confirm"
        className={INPUT}
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repite tu contraseña"
        autoComplete="new-password"
      />

      <button
        className="mt-[18px] cursor-pointer rounded-full border-none bg-black p-[11px] text-sm font-semibold text-white transition-colors hover:bg-[#3f3f46]"
        type="submit"
      >
        Registrarme
      </button>

      <p className="mt-4 text-center text-[13px] text-[#52525b]">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-black hover:underline"
          onClick={onGoLogin}
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
