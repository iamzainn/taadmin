/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { TravelOrder, PackageSubscription } from '@/lib/types';

interface TableActionsProps {
  onRefresh: () => Promise<void>;
  data: TravelOrder[] | PackageSubscription[];
  tableType: 'orders' | 'subscriptions';
}

export function TableActions({ onRefresh, data, tableType }: TableActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDownload = () => {
    if (data.length === 0) return;

    let worksheetData = [];
    let fileName = '';

    if (tableType === 'orders') {
      // Type assertion to tell TypeScript this is definitely TravelOrder[]
      const orderData = data as TravelOrder[];
      worksheetData = orderData.map(order => ({
        'Name': order.name,
        'Email': order.email,
        'Phone Number': order.phoneNumber,
        'Country': order.country,
        'Destination': order.Destination,
        'Order Date': new Date(order.createdAt).toLocaleDateString(),
      }));
      fileName = `travel-orders-${new Date().toISOString().split('T')[0]}`;
    } else {
      // Type assertion to tell TypeScript this is definitely PackageSubscription[]
      const subscriptionData = data as PackageSubscription[];
      worksheetData = subscriptionData.map(subscription => ({
        'First Name': subscription.firstName,
        'Last Name': subscription.lastName,
        'Email': subscription.email,
        'Phone Number': subscription.phoneNumber,
        'Country': subscription.country,
        'Package Name': subscription.TravelPackage.name,
        'Destination': subscription.TravelPackage.arrival,
        'Subscription Date': new Date(subscription.createdAt).toLocaleDateString(),
      }));
      fileName = `package-subscriptions-${new Date().toISOString().split('T')[0]}`;
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleRefresh} 
        variant="outline"
        disabled={isRefreshing}
      >
        <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
      <Button 
        onClick={handleDownload} 
        variant="outline"
        disabled={data.length === 0}
      >
        <Download className="h-4 w-4 mr-2" />
        Download Excel
      </Button>
    </div>
  );
}