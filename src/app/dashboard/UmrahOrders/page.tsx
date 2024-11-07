// app/dashboard/UmrahOrders/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from '@/components/TravelOrders/loadingSkelton';
import UmrahOrderTabs from '@/components/UmrahOrders/UmrahOrdersTabs';


export const metadata: Metadata = {
  title: 'Umrah Orders | Admin Dashboard',
  description: 'Manage custom Umrah orders and package subscriptions',
};

export default function UmrahOrdersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Umrah Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Umrah Order Management</CardTitle>
          <CardDescription>View and manage custom Umrah orders and package subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSkeleton />}>
            <UmrahOrderTabs />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}