'use client';

import { useTranslations } from 'next-intl';
import { SavedList } from '@/components/saved/SavedList';

export default function SavedPage() {
  const t = useTranslations('saved');

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-xl text-mahogany-200">{t('title')}</h2>
      <SavedList />
    </div>
  );
}
