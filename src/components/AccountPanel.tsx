import { useState } from 'react';
import { Check, KeyRound, Monitor, Save, ShieldCheck, X } from 'lucide-react';
import type { User } from '../types/store';

interface AccountPanelProps {
  user: User;
  onSaveProfile: (name: string, email: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function AccountPanel({ user, onSaveProfile, onLogout, onClose }: AccountPanelProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    if (!name.trim() || !email.trim()) return;
    onSaveProfile(name.trim(), email.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Mi cuenta">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div><span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Cuenta personal</span><h2 className="mt-2 text-xl font-bold text-primary">Mi cuenta</h2><p className="mt-1 text-sm text-[var(--text-light)]">Administra tu información y revisa la seguridad de tu sesión.</p></div>
          <button className="rounded-full border border-border p-2 text-[var(--text-light)] hover:bg-[var(--bg-alt)]" onClick={onClose} aria-label="Cerrar"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex gap-1 border-b border-border px-6 pt-3"><button className={`border-b-2 px-3 pb-3 text-sm font-semibold ${tab === 'profile' ? 'border-black text-black' : 'border-transparent text-[var(--text-light)]'}`} onClick={() => setTab('profile')}>Perfil</button><button className={`border-b-2 px-3 pb-3 text-sm font-semibold ${tab === 'security' ? 'border-black text-black' : 'border-transparent text-[var(--text-light)]'}`} onClick={() => setTab('security')}>Seguridad</button></div>
        <div className="p-6">
          {tab === 'profile' ? <div className="flex flex-col gap-4"><label className="text-sm font-semibold text-primary">Nombre<input className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-black" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="text-sm font-semibold text-primary">Correo electrónico<input className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-black" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><div className="rounded-lg bg-[var(--bg-alt)] p-3 text-sm text-[var(--text-light)]">Rol actual: <strong className="text-primary">{user.role === 'ADMINISTRADOR' ? 'Administrador de Plataforma' : 'Propietario de Tienda'}</strong></div><div className="flex items-center justify-between gap-3"><span className={`flex items-center gap-1.5 text-xs text-[#166534] ${saved ? '' : 'invisible'}`}><Check className="h-4 w-4" />Cambios guardados</span><button className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3f3f46]" onClick={saveProfile}><Save className="h-4 w-4" />Guardar perfil</button></div></div> : <div className="flex flex-col gap-4"><div className="flex items-start gap-3 rounded-lg border border-[#c1fbd4] bg-[#eafff0] p-4"><ShieldCheck className="mt-0.5 h-5 w-5 text-[#166534]" /><div><strong className="block text-sm text-primary">Cuenta protegida</strong><span className="text-xs leading-relaxed text-[var(--text-light)]">La gestión avanzada de sesiones estará disponible al conectar un backend.</span></div></div><div className="rounded-lg border border-border p-4"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-[var(--text-muted)]" /><div><strong className="block text-sm text-primary">Contraseña</strong><span className="text-xs text-[var(--text-light)]">Cambio de contraseña próximamente</span></div></div></div><div className="rounded-lg border border-border p-4"><div className="flex items-center gap-3"><Monitor className="h-5 w-5 text-[var(--text-muted)]" /><div className="flex-1"><strong className="block text-sm text-primary">Sesión actual</strong><span className="text-xs text-[var(--text-light)]">Este dispositivo · Activa ahora</span></div><span className="rounded-full bg-[#c1fbd4] px-2 py-1 text-[10px] font-semibold text-black">Actual</span></div></div><button className="rounded-full border border-[#f0b4b4] bg-white px-4 py-2.5 text-sm font-semibold text-[#991b1b] hover:bg-[#fff1f1]" onClick={onLogout}>Cerrar sesión</button><p className="m-0 text-xs leading-relaxed text-[var(--text-muted)]">En esta demo no hay otras sesiones reales para cerrar. Esta opción se conectará a la gestión de dispositivos en una fase posterior.</p></div>}
        </div>
      </div>
    </div>
  );
}
