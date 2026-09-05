import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';

interface AuthLayoutProps {
  mode: 'login' | 'register';
}

export function AuthLayout({ mode }: AuthLayoutProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(mode);
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to={currentUser.role === 'ADMINISTRADOR' ? '/admin' : '/app/tiendas'} replace />;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#fbfbf5] md:grid-cols-2">
      <div className="flex flex-col justify-center gap-[18px] bg-black px-14 py-16 text-white max-md:hidden">
        <div className="text-[26px] font-bold">🛍️ Mercatus</div>
        <h2 className="m-0 text-[30px] font-bold leading-tight text-white">Tu plataforma para crear tiendas en línea</h2>
        <p className="m-0 text-[15px] leading-relaxed text-[#d4d4d8]">
          Registra tu cuenta, crea tu tienda y gestiona productos, inventario y pedidos
          desde un solo panel.
        </p>
        <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
          <li className="text-sm text-[#d4d4d8]">🏪 Crea y configura tiendas ilimitadas</li>
          <li className="text-sm text-[#d4d4d8]">📦 Control de productos e inventario</li>
          <li className="text-sm text-[#d4d4d8]">🛒 Seguimiento de pedidos en tiempo real</li>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-[18px] px-8 py-12">
        <div className="w-full max-w-[380px] rounded-xl border border-[#e4e4e7] bg-white p-8 shadow-md">
          {currentMode === 'login' ? (
            <LoginView onGoRegister={() => setCurrentMode('register')} />
          ) : (
            <RegisterView onGoLogin={() => setCurrentMode('login')} />
          )}
        </div>
        <p className="max-w-[380px] text-center text-xs leading-relaxed text-[#71717a]">
          Demo: <strong>carlos@mercatus.app</strong> / <strong>demo1234</strong> (Propietario) ·
          <strong> admin@mercatus.app</strong> / <strong>admin1234</strong> (Administrador)
        </p>
      </div>
    </div>
  );
}
