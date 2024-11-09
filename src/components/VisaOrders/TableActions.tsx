'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download, Timer } from "lucide-react";
import * as XLSX from 'xlsx';
import { VisaOrder } from '@/lib/types/visa';

interface TableActionsProps {
  onRefresh: () => Promise<void>;
  data: VisaOrder[];
  tableType: 'visaOrders';
}

export function TableActions({ onRefresh, data }: TableActionsProps) {
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

    const worksheetData = data.map(order => ({
      'Full Name': order.fullName,
      'Email': order.email,
      'Phone Number': order.phoneNumber,
      'Nationality': order.nationality,
      'Number of Visas': order.numberOfVisas,
      'Travel Date': new Date(order.travelDate).toLocaleDateString(),
      'Processing Type': order.processingType,
      'Country': order.countryName,
      'Application Date': new Date(order.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visa Orders');

    // Generate filename with current date
    const fileName = `visa-orders-${new Date().toISOString().split('T')[0]}.xlsx`;

    XLSX.writeFile(workbook, fileName);
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