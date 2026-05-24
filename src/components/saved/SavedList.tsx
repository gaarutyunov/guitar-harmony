'use client';

import { useTranslations } from 'next-intl';
import { useHarmonyStore } from '@/stores/useHarmonyStore';
import { SavedCard } from './SavedCard';
import { useRouter } from 'next/navigation';

export function SavedList() {
  const t = useTranslations('saved');
  const saved = useHarmonyStore((s) => s.saved);
  const loadHarmony = useHarmonyStore((s) => s.loadHarmony);
  const deleteHarmony = useHarmonyStore((s) => s.deleteHarmony);
  const router = useRouter();

  function handleLoad(id: string) {
    loadHarmony(id);
    router.push('/harmony');
  }

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-heading text-mahogany-400">{t('empty')}</p>
        <p className="text-sm font-mono text-mahogany-600 mt-1">{t('empty_hint')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {saved.map((harmony) => (
        <SavedCard
          key={harmony.id}
          harmony={harmony}
          onLoad={() => handleLoad(harmony.id)}
          onDelete={() => deleteHarmony(harmony.id)}
        />
      ))}
    </div>
  );
}
