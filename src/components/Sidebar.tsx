import type { Role } from '../types/store';
import { ChartNoAxesCombined, CreditCard, Plus, Store } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userName: string;
  role: Role;
  isOpen?: boolean;
  onClose?: () => void;
}

const ROLE_LABEL: Record<Role, string> = {
  PROPIETARIO: 'Propietario de Tienda',
  ADMINISTRADOR: 'Administrador de Plataforma',
};

const LINK =
  'flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-[14px] py-2.5 text-left text-sm font-medium text-[#d4d4d8] transition-all hover:bg-[#1e2c31] hover:text-white';
const LINK_ACTIVE = 'bg-white text-black';

export function Sidebar({ activeView, onNavigate, userName, role, isOpen = false, onClose }: SidebarProps) {
  const isAdmin = role === 'ADMINISTRADOR';
  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-20 hidden cursor-default border-none bg-black/40 max-[768px]:block"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
      <aside className={`fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col overflow-y-auto bg-black text-white transition-transform duration-150 max-[768px]:z-30 max-[768px]:w-[280px] ${isOpen ? 'translate-x-0' : 'max-[768px]:-translate-x-full'}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 pb-4 pt-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#c1fbd4] text-lg font-bold text-black">M</div>
        <span className="text-lg font-bold tracking-[-0.3px]">Mercatus</span>
      </div>

      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.15] text-sm font-semibold">{userName.charAt(0)}</div>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold">{userName}</span>
          <span className="text-[11px] text-white/50">{ROLE_LABEL[role]}</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <span className="px-[14px] pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-[#71717a]">Resumen</span>
        <button
          className={`${LINK} ${activeView === 'dashboard' ? LINK_ACTIVE : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <ChartNoAxesCombined className="h-4 w-4" aria-hidden="true" />
          {isAdmin ? 'Dashboard' : 'Inicio'}
        </button>
        {isAdmin && (
          <button
            className={`${LINK} ${activeView === 'plans' ? LINK_ACTIVE : ''}`}
            onClick={() => onNavigate('plans')}
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Planes
          </button>
        )}
        <span className="px-[14px] pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.7px] text-[#71717a]">Tiendas</span>
        <button
          className={`${LINK} ${activeView === 'stores' || activeView === 'config' ? LINK_ACTIVE : ''}`}
          onClick={() => onNavigate('stores')}
        >
          <Store className="h-4 w-4" aria-hidden="true" />
          Mis Tiendas
        </button>
        <button
          className={`${LINK} ${activeView === 'create' ? LINK_ACTIVE : ''}`}
          onClick={() => onNavigate('create')}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear Tienda
        </button>
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-center">
        <span className="block text-[10px] uppercase tracking-[0.5px] text-white/35">Powered by</span>
        <span className="text-xs font-bold text-[#c1fbd4]">Mercatus Platform</span>
      </div>
      </aside>
    </>
  );
}
