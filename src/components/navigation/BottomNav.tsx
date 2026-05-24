'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useHarmonyStore } from '@/stores/useHarmonyStore';

const tabs = [
  { key: 'table', path: '/table', icon: '⊞' },
  { key: 'harmony', path: '/harmony', icon: '𝄞' },
  { key: 'saved', path: '/saved', icon: '◫' },
] as const;

export function BottomNav() {
  const t = useTranslations('tabs');
  const pathname = usePathname();
  const router = useRouter();
  const chordCount = useHarmonyStore((s) => s.current.chords.length);
  const savedCount = useHarmonyStore((s) => s.saved.length);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  function getBadge(key: string): number | null {
    if (key === 'harmony' && chordCount > 0) return chordCount;
    if (key === 'saved' && savedCount > 0) return savedCount;
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-mahogany-950/95 border-t border-mahogany-800/50 backdrop-blur-sm">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === `${basePath}${tab.path}` || pathname === tab.path;
          const badge = getBadge(tab.key);

          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? 'text-amber-400' : 'text-mahogany-500 hover:text-mahogany-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-mono">{t(tab.key)}</span>
              {badge !== null && (
                <span className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-amber-500 text-mahogany-950 text-[10px] font-mono font-bold px-1">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
