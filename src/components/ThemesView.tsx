import { useState } from 'react';
import type { StoreWithMetrics } from '../types/store';
import { STORE_THEME_PRESETS, resolveStoreTheme } from '../data/storeThemes';
import { Check, Eye, GripVertical, Palette, Save } from 'lucide-react';

interface ThemesViewProps {
  store: StoreWithMetrics;
  onPublish: (presetId: string, sections: ThemeSections) => void;
}

interface ThemeSections {
  hero: boolean;
  featuredProducts: boolean;
  categories: boolean;
  footer: boolean;
}

const SECTION_LABELS: Array<{ id: keyof ThemeSections; label: string; description: string }> = [
  { id: 'hero', label: 'Banner principal', description: 'Presenta tu tienda y su propuesta.' },
  { id: 'featuredProducts', label: 'Productos destacados', description: 'Muestra una selección del catálogo.' },
  { id: 'categories', label: 'Categorías', description: 'Ayuda a explorar tus colecciones.' },
  { id: 'footer', label: 'Pie de página', description: 'Incluye información final de la tienda.' },
];

export function ThemesView({ store, onPublish }: ThemesViewProps) {
  const currentTheme = resolveStoreTheme(store.theme);
  const publishedId = store.theme?.presetId ?? 'base';
  const [draftId, setDraftId] = useState(publishedId);
  const [sections, setSections] = useState<ThemeSections>(store.theme?.sections ?? {
    hero: true,
    featuredProducts: true,
    categories: true,
    footer: true,
  });
  const hasDraft = draftId !== publishedId;

  return (
    <div className="max-w-[980px]">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Palette className="h-5 w-5 text-[var(--accent-text)]" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[var(--accent-text)]">Tienda online</span>
        </div>
        <h1 className="m-0 text-2xl font-bold text-primary">Temas</h1>
        <p className="mb-0 mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">
          Elige una base visual para tu storefront. Puedes probar una opción antes de publicarla y cambiarla cuando quieras.
        </p>
      </div>

      <section className="mb-6 rounded-md border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-base font-bold text-primary">Tema publicado</h2>
            <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">Es el diseño que verán tus clientes.</p>
          </div>
          <span className="rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--success-text)]">Publicado</span>
        </div>
        <div className="flex items-center gap-4 rounded-sm border border-border bg-[var(--bg-alt)] p-4">
          <div className="h-16 w-24 shrink-0 rounded-sm" style={{ background: `linear-gradient(135deg, ${currentTheme.primary} 55%, ${currentTheme.accent} 55%)` }} />
          <div>
            <h3 className="m-0 text-sm font-bold text-[var(--text)]">{STORE_THEME_PRESETS.find((theme) => theme.id === publishedId)?.label ?? 'Tema personalizado'}</h3>
            <p className="mb-0 mt-1 text-xs text-[var(--text-light)]">Activo para {store.name}</p>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-[minmax(0,1fr)_280px] gap-5 rounded-md border border-border bg-card p-5 max-[900px]:grid-cols-1">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-bold text-primary">Editor visual</h2>
              <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">Activa las secciones que quieres mostrar en tu página de inicio.</p>
            </div>
            {hasDraft && <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1 text-xs font-semibold text-[var(--warning-text)]">Borrador</span>}
          </div>
          <div className="flex flex-col gap-2">
            {SECTION_LABELS.map((section) => (
              <div key={section.id} className="flex items-center gap-3 rounded-sm border border-border bg-[var(--bg-alt)] px-3 py-2.5">
                <GripVertical className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--text)]">{section.label}</span>
                  <span className="block text-xs text-[var(--text-muted)]">{section.description}</span>
                </div>
                <button
                  type="button"
                  className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-xl border-none p-0 transition-colors ${sections[section.id] ? 'bg-[var(--success)]' : 'bg-[var(--border-dark)]'}`}
                  onClick={() => setSections((current) => ({ ...current, [section.id]: !current[section.id] }))}
                  role="switch"
                  aria-checked={sections[section.id]}
                  aria-label={`Mostrar ${section.label}`}
                >
                  <span className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${sections[section.id] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-sm border border-border bg-[var(--bg-alt)] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]"><Eye className="h-4 w-4" aria-hidden="true" /> Vista previa de inicio</div>
          <div className="overflow-hidden rounded-sm bg-white shadow-sm">
            {sections.hero && <div className="p-3 text-xs font-bold text-white" style={{ background: currentTheme.primary }}>Tu próxima compra empieza aquí</div>}
            {sections.categories && <div className="flex gap-1.5 p-2"><span className="h-4 flex-1 rounded-sm" style={{ background: currentTheme.accent }} /><span className="h-4 flex-1 rounded-sm bg-black/10" /><span className="h-4 flex-1 rounded-sm bg-black/10" /></div>}
            {sections.featuredProducts && <div className="grid grid-cols-3 gap-1.5 p-2"><span className="h-10 rounded-sm" style={{ background: currentTheme.accent }} /><span className="h-10 rounded-sm bg-black/10" /><span className="h-10 rounded-sm bg-black/10" /></div>}
            {sections.footer && <div className="h-3 bg-black/10" />}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="m-0 text-base font-bold text-primary">Explorar temas</h2>
          <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">Selecciona el estilo que mejor represente tu negocio.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          {STORE_THEME_PRESETS.slice(0, 7).map((preset) => {
            const isPublished = publishedId === preset.id;
            return (
              <article key={preset.id} className={`overflow-hidden rounded-md border bg-card transition-shadow hover:shadow-md ${isPublished ? 'border-[var(--success-text)]' : 'border-border'}`}>
                <div className="relative h-32 p-4" style={{ background: preset.theme.surface ?? '#ffffff' }}>
                  <div className="h-full rounded-sm p-3 shadow-sm" style={{ background: preset.theme.primary }}>
                    <div className="mb-3 h-2 w-2/3 rounded-full bg-white/80" />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((item) => <span key={item} className="h-12 rounded-sm" style={{ background: preset.theme.accent }} />)}
                    </div>
                  </div>
                  {isPublished && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[var(--success-text)]"><Check className="h-3 w-3" /> Actual</span>}
                </div>
                <div className="p-4">
                  <h3 className="m-0 text-sm font-bold text-[var(--text)]">{preset.label}</h3>
                  <p className="mb-4 mt-1 min-h-8 text-xs leading-relaxed text-[var(--text-light)]">
                    {preset.id === 'base' ? 'Limpio y versátil para cualquier catálogo.' : preset.id === 'indigo' ? 'Moderno y tecnológico para marcas digitales.' : preset.id === 'esmeralda' ? 'Natural y cercano para productos con identidad.' : preset.id === 'indice' ? 'Editorial, visual y pensado para contar una selección.' : preset.id === 'orbe' ? 'Oscuro, mobile-first y enfocado en tecnología.' : preset.id === 'ficha' ? 'Claro, técnico y orientado a comparar productos.' : 'Una identidad visual diferenciada para tu tienda.'}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-border bg-[var(--bg-alt)] px-3 py-2 text-xs font-semibold text-[var(--text)]" onClick={() => setDraftId(preset.id)}>
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Vista previa
                    </button>
                    <button type="button" className="flex-1 cursor-pointer rounded-sm border-none bg-accent px-3 py-2 text-xs font-semibold text-(--on-accent) disabled:cursor-default disabled:opacity-50" onClick={() => { setDraftId(preset.id); onPublish(preset.id, sections); }} disabled={isPublished && !hasDraft}>
                      {isPublished && !hasDraft ? 'Publicado' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {hasDraft && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-[var(--warning-soft)] bg-[var(--warning-soft)] px-4 py-3 max-[640px]:items-stretch max-[640px]:flex-col">
          <span className="text-sm text-[var(--text-light)]">Tienes cambios visuales listos para publicar.</span>
          <button type="button" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border-none bg-accent px-4 py-2 text-sm font-semibold text-(--on-accent)" onClick={() => onPublish(draftId, sections)}>
            <Save className="h-4 w-4" aria-hidden="true" /> Publicar cambios
          </button>
        </div>
      )}
    </div>
  );
}
