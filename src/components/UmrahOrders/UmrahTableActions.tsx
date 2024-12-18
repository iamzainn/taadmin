'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download, Timer } from "lucide-react";
import * as XLSX from 'xlsx';
import { CustomUmrahOrder, UmrahPackageSubscription } from '@/lib/types/umrah';

interface UmrahTableActionsProps {
  onRefresh: () => Promise<void>;
  data: CustomUmrahOrder[] | UmrahPackageSubscription[];
  tableType: 'umrahOrders' | 'umrahSubscriptions';
}

export function UmrahTableActions({ onRefresh, data, tableType }: UmrahTableActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const refreshData = () => {
      if (autoRefreshEnabled && !document.hidden) {
        handleRefresh();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && autoRefreshEnabled) {
        refreshData();
        // Reset interval when page becomes visible
        clearInterval(intervalId);
        intervalId = setInterval(refreshData, 15000);
      } else {
        clearInterval(intervalId);
      }
    };

    if (autoRefreshEnabled) {
      intervalId = setInterval(refreshData, 15000);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoRefreshEnabled, onRefresh]);

  const handleDownload = () => {
    if (data.length === 0) return;

    type ExcelRow = Record<string, string | number>;
    let worksheetData: ExcelRow[] = [];
    let fileName: string;

    if (tableType === 'umrahOrders') {
      worksheetData = (data as CustomUmrahOrder[]).map(order => ({
        'Full Name': order.fullName,
        'Email': order.email,
        'Phone Number': order.phoneNumber,
        'Family Members': order.familyMembers,
        'Travel Date': new Date(order.travelDate).toLocaleDateString(),
        'Duration (Days)': order.durationInDays,
        'Transport Needed': order.transportNeeded ? 'Yes' : 'No',
        'Order Date': new Date(order.createdAt).toLocaleDateString(),
      }));
      fileName = `umrah-orders-${new Date().toISOString().split('T')[0]}`;
    } else {
      worksheetData = (data as UmrahPackageSubscription[]).map(subscription => ({
        'First Name': subscription.firstName,
        'Last Name': subscription.lastName,
        'Email': subscription.email,
        'Phone Number': subscription.phoneNumber,
        'Country': subscription.country,
        'Package Name': subscription.UmrahPackage.title,
        'Package Price Type': subscription.packagePriceType,
        'Subscription Date': new Date(subscription.createdAt).toLocaleDateString(),
      }));
      fileName = `umrah-subscriptions-${new Date().toISOString().split('T')[0]}`;
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)} 
        variant="outline"
        className={autoRefreshEnabled ? 'bg-green-50' : ''}
      >
        <Timer className="h-4 w-4 mr-2" />
        {autoRefreshEnabled ? 'Auto-refresh On' : 'Auto-refresh Off'}
      </Button>
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