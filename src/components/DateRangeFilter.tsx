'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const params = new URLSearchParams(searchParams);
      params.set('startDate', startDate);
      params.set('endDate', endDate);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-40"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-40"
      />
      <Button onClick={handleApplyFilter}>Apply Date Filter</Button>
    </div>
  );
}
