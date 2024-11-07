'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { UmrahPackageSubscription } from '@/lib/types/umrah';
import { DateRangeFilter } from '../DateRangeFilter';
import { NameSearchFilter } from './filters/NameSearchFilter';
import { PackageNameFilter } from './filters/PackageNameFilter';

import { DataTableUmrahSubscription } from './DataTableUmrahSubscription';
import { UmrahTableActions } from './UmrahTableActions';


export default function UmrahPackageSubscriptions() {
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<UmrahPackageSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/umrah/subscriptions?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Umrah Package Subscriptions</h2>
        <UmrahTableActions 
          onRefresh={fetchSubscriptions}
          data={subscriptions}
          tableType="umrahSubscriptions"
        />
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <NameSearchFilter 
            placeholder="Search by customer name..."
            paramName="name"
          />
          <PackageNameFilter />
          <DateRangeFilter />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">Loading subscriptions...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {!isLoading && !error && subscriptions.length === 0 && (
        <div className="text-center py-4">No subscriptions found</div>
      )}

      {!isLoading && !error && subscriptions.length > 0 && (
        <DataTableUmrahSubscription 
          data={subscriptions} 
          onDataChange={fetchSubscriptions} 
        />
      )}
    </div>
  );
}