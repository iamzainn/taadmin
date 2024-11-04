'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export function DestinationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const debouncedDestination = useDebounce(destination, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedDestination) {
      params.set('destination', debouncedDestination);
    } else {
      params.delete('destination');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedDestination, router, pathname, searchParams]);

  return (
    <Input
      type="text"
      placeholder="Search by destination..."
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      className="w-64"
    />
  );
}