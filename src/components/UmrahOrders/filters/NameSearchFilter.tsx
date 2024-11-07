'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

interface NameSearchFilterProps {
  placeholder: string;
  paramName: string;
}

export function NameSearchFilter({ placeholder, paramName }: NameSearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get(paramName) || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set(paramName, debouncedSearchTerm);
    } else {
      params.delete(paramName);
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, router, pathname, searchParams, paramName]);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-64"
    />
  );
}