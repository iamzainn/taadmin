'use client';
import { useEffect, useState } from 'react';

import { DestinationFilter } from './DestinationFilter';
import { DataTableCustomTravel } from './DataTableCustomTravel';
import { useSearchParams } from 'next/navigation';
import { DateRangeFilter } from '../DateRangeFilter';

export interface TravelOrder {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  Destination: string;
  createdAt: string;
  // Add other fields as per your schema
}

export default function CustomTravelOrders() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<TravelOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/orders?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.orders || []); // Assuming the API returns { orders: [] }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams]); // This will re-fetch when filters change

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Custom Travel Orders</h2>
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <DestinationFilter />
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
        <DataTableCustomTravel data={orders} />
      )}
    </div>
  );
}