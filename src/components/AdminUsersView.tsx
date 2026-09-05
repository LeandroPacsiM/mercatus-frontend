import { useMemo, useState } from 'react';
import type { Customer, Role, User } from '../types/store';
import { Ban, Eye, Search } from 'lucide-react';

interface AdminUsersViewProps {
  users: User[];
  customers: Customer[];
  stores: { id: string; name: string; ownerId: string }[];
  suspendedUserIds: string[];
  onToggleUser: (userId: string) => void;
}

type UserFilter = 'ALL' | Role | 'CLIENTE' | 'SUSPENDED';

function roleLabel(role: Role | 'CLIENTE'): string {
  return role === 'ADMINISTRADOR' ? 'Administrador' : role === 'PROPIETARIO' ? 'Propietario' : 'Cliente';
}

export function AdminUsersView({ users, customers, stores, suspendedUserIds, onToggleUser }: AdminUsersViewProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<UserFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const platformUsers = users.map((user) => ({ id: user.id, name: user.name, email: user.email, role: user.role as Role | 'CLIENTE', detail: stores.filter((store) => store.ownerId === user.id).map((store) => store.name).join(', ') || 'Sin tienda asociada' }));
    const customerUsers = customers.map((customer) => ({ id: customer.id, name: customer.name, email: customer.email, role: 'CLIENTE' as const, detail: stores.find((store) => store.id === customer.store_id)?.name ?? 'Tienda no encontrada' }));
    return [...platformUsers, ...customerUsers].filter((user) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery = !normalizedQuery || user.name.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'ALL' || filter === 'SUSPENDED' && suspendedUserIds.includes(user.id) || filter !== 'SUSPENDED' && user.role === filter;
      return matchesQuery && matchesFilter;
    });
  }, [customers, filter, query, stores, suspendedUserIds]);

  const selectedUser = rows.find((user) => user.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-5">
        <span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Acceso y permisos</span>
        <h2 className="mt-2 text-2xl font-bold text-primary">Usuarios de Mercatus</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">Consulta quién utiliza la plataforma y revisa su rol. Esta vista demo permite suspender o reactivar cuentas durante la sesión.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <label className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-[var(--text-light)]"><Search className="h-4 w-4" aria-hidden="true" /><input className="w-full border-none bg-transparent text-sm text-primary outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o correo" /></label>
          <div className="flex flex-wrap rounded-lg border border-border bg-white p-1">
            {([['ALL', 'Todos'], ['PROPIETARIO', 'Propietarios'], ['CLIENTE', 'Clientes'], ['SUSPENDED', 'Suspendidos']] as const).map(([value, label]) => (
              <button key={value} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === value ? 'bg-black text-white' : 'text-[var(--text-light)] hover:bg-[var(--bg-alt)]'}`} onClick={() => setFilter(value)}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-[var(--bg-alt)] text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]"><tr><th className="px-5 py-3 font-semibold">Usuario</th><th className="px-5 py-3 font-semibold">Rol</th><th className="px-5 py-3 font-semibold">Contexto</th><th className="px-5 py-3 font-semibold">Estado</th><th className="px-5 py-3 text-right font-semibold">Acciones</th></tr></thead>
            <tbody>
              {rows.map((user) => {
                const suspended = suspendedUserIds.includes(user.id);
                return <tr key={user.id} className="border-t border-border">
                  <td className="px-5 py-4"><span className="block font-semibold text-primary">{user.name}</span><span className="text-xs text-[var(--text-light)]">{user.email}</span></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'PROPIETARIO' ? 'bg-[#c1fbd4] text-black' : user.role === 'ADMINISTRADOR' ? 'bg-black text-white' : 'bg-[var(--bg-alt)] text-primary'}`}>{roleLabel(user.role)}</span></td>
                  <td className="max-w-[220px] truncate px-5 py-4 text-[var(--text-light)]">{user.detail}</td>
                  <td className="px-5 py-4"><span className={suspended ? 'text-[#991b1b]' : 'text-[#166534]'}>{suspended ? 'Suspendido' : 'Activo'}</span></td>
                  <td className="px-5 py-4 text-right"><button className="mr-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-alt)]" onClick={() => setSelectedId(user.id)}><Eye className="h-3.5 w-3.5" aria-hidden="true" />Detalle</button>{user.role !== 'ADMINISTRADOR' && <button className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${suspended ? 'bg-black text-white' : 'border border-[#f0b4b4] bg-white text-[#991b1b]'}`} onClick={() => onToggleUser(user.id)}><Ban className="h-3.5 w-3.5" aria-hidden="true" />{suspended ? 'Reactivar' : 'Suspender'}</button>}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="px-5 py-12 text-center text-sm text-[var(--text-light)]">No encontramos usuarios con esos filtros.</p>}
      </section>

      {selectedUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={`Detalle de ${selectedUser.name}`}><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Vista administrativa</span><h2 className="mt-2 text-xl font-bold text-primary">{selectedUser.name}</h2></div><button className="rounded-full border border-border px-3 py-1 text-sm" onClick={() => setSelectedId(null)}>Cerrar</button></div><div className="mt-5 space-y-3 text-sm"><p><strong>Correo:</strong> {selectedUser.email}</p><p><strong>Rol:</strong> {roleLabel(selectedUser.role)}</p><p><strong>Contexto:</strong> {selectedUser.detail}</p></div><p className="mt-5 text-sm leading-relaxed text-[var(--text-light)]">Los permisos avanzados por módulo quedan para una fase posterior. Esta vista solo demuestra supervisión básica.</p></div></div>}
    </div>
  );
}
