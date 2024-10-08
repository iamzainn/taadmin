import { Suspense } from 'react';
import { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LoadingSkeleton } from '@/components/Orders/loadingSkelton';
import TravelOrderTabs from '@/components/Orders/TravelOrderTabs';


export const metadata: Metadata = {
  title: 'Travel Orders | Admin Dashboard',
  description: 'Manage custom travel orders and package subscriptions',
};

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Travel Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage custom travel orders and package subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
         <Suspense fallback={<LoadingSkeleton />}>
          <TravelOrderTabs />
         </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}