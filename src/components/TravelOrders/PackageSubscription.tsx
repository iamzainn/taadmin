'use client';
import { useEffect, useState, useCallback } from 'react';

import { DestinationFilter } from './DestinationFilter';
import { DataTablePackageSubscription } from './DataTablePackageSubscription';

import { useSearchParams } from 'next/navigation';
import { PackageSubscription } from '@/lib/types';
import { TableActions } from '../TableActions';
import { DateRangeFilter } from '../DateRangeFilter';

export default function PackageSubscriptions() {
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<PackageSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/subscriptions?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      console.log("date subscription :",data)
      if (data.success) {
        setSubscriptions(data.subscriptions);
      } else {
        throw new Error(data.error || 'Failed to fetch subscriptions');
      }
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
        <h2 className="text-2xl font-bold">Travel Packages Customer Subscription</h2>
        <TableActions 
          onRefresh={fetchSubscriptions}
          data={subscriptions}
          tableType="subscriptions"
        />
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <DestinationFilter />
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
        <DataTablePackageSubscription data={subscriptions} />
      )}
    </div>
  );
}