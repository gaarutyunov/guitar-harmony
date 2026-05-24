'use client';

import { ModeToggle } from '@/components/table/ModeToggle';
import { KeyFilter } from '@/components/table/KeyFilter';
import { CommonProgressions } from '@/components/table/CommonProgressions';
import { ProgressionTable } from '@/components/table/ProgressionTable';

export default function TablePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ModeToggle />
      </div>
      <KeyFilter />
      <CommonProgressions />
      <ProgressionTable />
    </div>
  );
}
