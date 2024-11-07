'use client';

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export function PackageNameFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [packageName, setPackageName] = useState(searchParams.get('packageName') || '');
  const debouncedPackageName = useDebounce(packageName, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedPackageName) {
      params.set('packageName', debouncedPackageName);
    } else {
      params.delete('packageName');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedPackageName, router, pathname, searchParams]);

  return (
    <Input
      type="text"
      placeholder="Search by package name..."
      value={packageName}
      onChange={(e) => setPackageName(e.target.value)}
      className="w-64"
    />
  );
}