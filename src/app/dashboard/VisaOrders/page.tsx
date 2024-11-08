import { Suspense } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import VisaOrdersTable from '@/components/VisaOrders/VisaOrdersTable';
import { LoadingSkeleton } from '@/components/VisaOrders/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Visa Orders | Admin Dashboard',
  description: 'Manage visa applications and orders',
};

export const dynamic = 'force-dynamic';

export default function VisaOrdersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Visa Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Visa Order Management</CardTitle>
          <CardDescription>View and manage visa applications and orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSkeleton />}>
            <VisaOrdersTable  />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
