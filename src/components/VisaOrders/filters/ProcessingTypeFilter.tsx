// components/VisaOrders/filters/ProcessingTypeFilter.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ProcessingTypes } from '@/lib/types/visa';

export function ProcessingTypeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams.get('processingType') || undefined;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('processingType', value);
    } else {
      params.delete('processingType');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Processing Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value={ProcessingTypes.NORMAL}>Normal</SelectItem>
        <SelectItem value={ProcessingTypes.URGENT}>Urgent</SelectItem>
      </SelectContent>
    </Select>
  );
}