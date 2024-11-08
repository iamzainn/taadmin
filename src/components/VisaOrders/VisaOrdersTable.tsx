'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { VisaOrder } from '@/lib/types/visa';
import { DateRangeFilter } from '../DateRangeFilter';

import { DataTableVisaOrders } from './DataTableVisaOrders';
import { NameSearchFilter } from './filters/NameSearchFilter';
import { ProcessingTypeFilter } from './filters/ProcessingTypeFilter';
import { TableActions } from './TableActions';

export default function VisaOrdersTable() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<VisaOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/visa/orders?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Visa Orders</h2>
        <TableActions 
          onRefresh={fetchOrders}
          data={orders}
          tableType="visaOrders"
        />
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <NameSearchFilter 
            placeholder="Search by name..."
            paramName="name"
          />
          <ProcessingTypeFilter />
          <DateRangeFilter />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">Loading orders...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-4">No orders found</div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <DataTableVisaOrders 
          data={orders} 
          onDataChange={fetchOrders} 
        />
      )}
    </div>
  );
}