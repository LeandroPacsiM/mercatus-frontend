import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, FileText, Store, Users } from 'lucide-react';
import type { Plan, StoreWithMetrics } from '../types/store';

interface AdminActivityReportsViewProps {
  mode: 'activity' | 'reports';
  stores: StoreWithMetrics[];
  plans: Plan[];
}

const EVENTS = [
  { id: 1, type: 'Tienda', title: 'Gaming Zone fue revisada', detail: 'Supervisión administrativa', time: 'Hace 18 min', icon: Store },
  { id: 2, type: 'Usuario', title: 'Nuevo propietario registrado', detail: 'Cuenta creada en Mercatus', time: 'Hace 1 h', icon: Users },
  { id: 3, type: 'Plan', title: 'Plan Pro consultado', detail: 'Configuración de suscripción', time: 'Hace 3 h', icon: FileText },
  { id: 4, type: 'Sistema', title: 'Plataforma operativa', detail: 'Verificación automática demo', time: 'Ayer', icon: CheckCircle2 },
];

export function AdminActivityReportsView({ mode, stores, plans }: AdminActivityReportsViewProps) {
  const [filter, setFilter] = useState('Todos');
  const totalOrders = stores.reduce((total, store) => total + store.metrics.orders, 0);
  const totalRevenue = stores.reduce((total, store) => total + store.metrics.revenue, 0);
  const activePlans = plans.length;
  const visibleEvents = useMemo(() => filter === 'Todos' ? EVENTS : EVENTS.filter((event) => event.type === filter), [filter]);

  if (mode === 'activity') {
    return (
      <div className="flex flex-col gap-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[#c1fbd4] p-3 text-black"><Activity className="h-5 w-5" aria-hidden="true" /></div>
            <div><span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Supervisión</span><h2 className="mt-2 text-2xl font-bold text-primary">Actividad reciente</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">Consulta eventos importantes de la plataforma para entender qué está ocurriendo. Estos eventos son demostrativos y se reinician al recargar.</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{['Todos', 'Tienda', 'Usuario', 'Plan', 'Sistema'].map((item) => <button key={item} className={`rounded-full px-3 py-2 text-xs font-semibold ${filter === item ? 'bg-black text-white' : 'border border-border bg-white text-primary hover:bg-[var(--bg-alt)]'}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3">{visibleEvents.map((event) => <div key={event.id} className="flex items-start gap-3 rounded-lg border border-border p-4"><div className="rounded-lg bg-[var(--bg-alt)] p-2 text-primary"><event.icon className="h-4 w-4" aria-hidden="true" /></div><div className="min-w-0 flex-1"><p className="m-0 text-sm font-semibold text-primary">{event.title}</p><p className="mt-1 text-xs text-[var(--text-light)]">{event.detail}</p></div><span className="whitespace-nowrap text-xs text-[var(--text-muted)]">{event.time}</span></div>)}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-[#c1fbd4] p-3 text-black"><BarChart3 className="h-5 w-5" aria-hidden="true" /></div><div><span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Resumen global</span><h2 className="mt-2 text-2xl font-bold text-primary">Reportes de plataforma</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">Indicadores para supervisar el crecimiento y el estado general de Mercatus. No sustituyen los reportes detallados de cada tienda.</p></div></div></section>
      <div className="grid grid-cols-3 gap-4 max-[768px]:grid-cols-1"><div className="rounded-xl border border-border bg-card p-5"><Store className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true" /><strong className="mt-4 block text-2xl text-primary">{stores.length}</strong><span className="text-sm text-[var(--text-light)]">Tiendas registradas</span></div><div className="rounded-xl border border-border bg-card p-5"><Activity className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true" /><strong className="mt-4 block text-2xl text-primary">{totalOrders}</strong><span className="text-sm text-[var(--text-light)]">Pedidos acumulados</span></div><div className="rounded-xl border border-border bg-card p-5"><BarChart3 className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true" /><strong className="mt-4 block text-2xl text-primary">S/ {totalRevenue.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</strong><span className="text-sm text-[var(--text-light)]">Ventas acumuladas</span></div></div>
      <section className="rounded-xl border border-border bg-card p-5"><h3 className="m-0 text-base font-bold text-primary">Lectura rápida</h3><div className="mt-4 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1"><div className="flex items-center gap-3 rounded-lg bg-[var(--bg-alt)] p-4"><CheckCircle2 className="h-5 w-5 text-[#166534]" aria-hidden="true" /><div><strong className="block text-sm text-primary">{stores.filter((store) => store.active).length} activas</strong><span className="text-xs text-[var(--text-light)]">Tiendas operativas</span></div></div><div className="flex items-center gap-3 rounded-lg bg-[var(--bg-alt)] p-4"><FileText className="h-5 w-5 text-primary" aria-hidden="true" /><div><strong className="block text-sm text-primary">{activePlans} planes</strong><span className="text-xs text-[var(--text-light)]">Configurados actualmente</span></div></div></div><p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[var(--text-muted)]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Los reportes actuales usan datos semilla y sirven para demostrar la experiencia administrativa. Los reportes reales requieren persistencia y una fuente de datos centralizada.</p></section>
    </div>
  );
}
