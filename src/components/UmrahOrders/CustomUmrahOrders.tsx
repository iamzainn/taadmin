'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomUmrahOrder } from '@/lib/types/umrah';
import { DateRangeFilter } from '../DateRangeFilter';
import { NameSearchFilter } from './filters/NameSearchFilter';

import { DataTableCustomUmrah } from './DataTableCustomUmrah';
import { UmrahTableActions } from './UmrahTableActions';


export default function CustomUmrahOrders() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<CustomUmrahOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/umrah/orders?${searchParams.toString()}`);
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
        <h2 className="text-2xl font-bold">Custom Umrah Orders</h2>
        <UmrahTableActions
          onRefresh={fetchOrders}
          data={orders}
          tableType="umrahOrders"
        />
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <NameSearchFilter 
            placeholder="Search by name..."
            paramName="name"
          />
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
        <DataTableCustomUmrah 
          data={orders} 
          onDataChange={fetchOrders} 
        />
      )}
    </div>
  );
}