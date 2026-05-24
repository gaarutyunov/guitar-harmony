'use client';

import { BottomNav } from '@/components/navigation/BottomNav';
import { LocaleSwitcher } from '@/components/settings/LocaleSwitcher';
import { FingeringToggle } from '@/components/settings/FingeringToggle';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-mahogany-950/95 border-b border-mahogany-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2 max-w-lg mx-auto">
          <h1 className="font-heading font-bold text-lg text-amber-400 tracking-wide">
            GuitarHarmony
          </h1>
          <div className="flex items-center gap-2">
            <FingeringToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4">{children}</main>

      {/* Navigation */}
      <BottomNav />
    </div>
  );
}
