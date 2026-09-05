import { Link } from 'react-router-dom';

interface MarqueeItem {
  name: string;
  href?: string;
}

interface LogoMarqueeProps {
  eyebrow: string;
  items: MarqueeItem[];
  tone?: 'light' | 'dark';
}

export function LogoMarquee({ eyebrow, items, tone = 'light' }: LogoMarqueeProps) {
  // ×8 para que media pista supere cualquier viewport: dos mitades idénticas (4 grupos c/u) = loop -50% sin saltos
  const loop = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];
  const itemTone =
    tone === 'dark'
      ? 'text-white/50 hover:text-white'
      : 'text-[var(--text-light)] hover:text-[var(--text)]';
  const eyebrowTone =
    tone === 'dark' ? 'text-white/40' : 'text-[var(--text-muted)]';
  return (
    <div className="py-10 text-center">
      <span className={`mb-5 inline-block text-xs font-bold uppercase tracking-[0.7px] ${eyebrowTone}`}>
        {eyebrow}
      </span>
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className={`marquee-track flex w-max animate-marquee hover:[animation-play-state:paused] ${itemTone}`}>
          {loop.map((item, i) => {
            const inner = item.name;
            const cls =
              'flex h-20 min-w-[220px] cursor-pointer items-center justify-center text-[22px] font-bold tracking-[2px] no-underline opacity-60 grayscale transition-all duration-150 hover:scale-[1.08] hover:opacity-100 hover:grayscale-0 hover:no-underline';
            return item.href ? (
              <Link
                key={`${item.name}-${i}`}
                to={item.href}
                aria-hidden={i >= items.length}
                tabIndex={i >= items.length ? -1 : undefined}
                className={cls}
                style={{ color: 'inherit' }}
              >
                {inner}
              </Link>
            ) : (
              <span
                key={`${item.name}-${i}`}
                aria-hidden={i >= items.length}
                className={`${cls} cursor-default`}
              >
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
