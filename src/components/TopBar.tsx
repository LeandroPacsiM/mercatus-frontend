
import { LogOut, Search, UserCircle } from 'lucide-react';

interface TopBarProps {
  title: string;
  userName: string;
  onCreateStore?: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onOpenAccount: () => void;
}

export function TopBar({ title, userName, onCreateStore, onLogout, onToggleSidebar, onOpenAccount }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e4e4e7] bg-[#fbfbf5] px-6">
      <button
        className="hidden cursor-pointer flex-col gap-1 border-none bg-transparent p-1 max-[768px]:flex"
        onClick={onToggleSidebar}
        aria-label="Menu"
      >
        <span className="block h-0.5 w-5 rounded-sm bg-[var(--text)]"></span>
        <span className="block h-0.5 w-5 rounded-sm bg-[var(--text)]"></span>
        <span className="block h-0.5 w-5 rounded-sm bg-[var(--text)]"></span>
      </button>

      <div className="flex min-w-0 items-center gap-6">
        <h1 className="m-0 text-xl font-bold text-black max-[768px]:text-base">{title}</h1>
        <div className="flex h-9 w-[260px] items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm text-[#71717a] max-[900px]:hidden">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Buscar en Mercatus</span>
          <kbd className="ml-auto rounded bg-[#f4f4f5] px-1.5 py-0.5 text-[10px] text-[#71717a]">⌘ K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onCreateStore && (
          <button
            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3f3f46] max-[768px]:px-3 max-[768px]:py-1.5 max-[768px]:text-xs"
            onClick={onCreateStore}
          >
            + Crear Tienda
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-alt)]" onClick={onOpenAccount}><UserCircle className="h-4 w-4" aria-hidden="true" />{userName}</button>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-[var(--text-light)] transition-all hover:bg-[var(--bg-alt)] hover:text-[var(--text)]"
            onClick={onLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="max-[640px]:hidden">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
