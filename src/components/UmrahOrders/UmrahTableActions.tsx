'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { CustomUmrahOrder, UmrahPackageSubscription } from '@/lib/types/umrah';

type CellStyle = {
  fill?: { fgColor: { rgb: string } };
  font?: { color?: { rgb: string }; bold?: boolean };
  alignment?: { horizontal: string };
};



interface UmrahTableActionsProps {
  onRefresh: () => Promise<void>;
  data: CustomUmrahOrder[] | UmrahPackageSubscription[];
  tableType: 'umrahOrders' | 'umrahSubscriptions';
}

export function UmrahTableActions({ onRefresh, data, tableType }: UmrahTableActionsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const createExcelStyles = () => {
    const headerStyle: CellStyle = {
      fill: { fgColor: { rgb: "4F46E5" } },
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center" }
    };

    const highlightedStyle: CellStyle = {
      fill: { fgColor: { rgb: "EEF2FF" } },
      font: { color: { rgb: "000000" } }
    };

    const dateStyle: CellStyle = {
      font: { color: { rgb: "059669" } },
      alignment: { horizontal: "center" }
    };

    return { headerStyle, highlightedStyle, dateStyle };
  };

 

  const handleDownload = () => {
    if (data.length === 0) return;

    let worksheetData: Record<string, string>[] = [];
    let fileName: string;

    if (tableType === 'umrahOrders') {
      worksheetData = (data as CustomUmrahOrder[]).map(order => ({
        'Full Name': order.fullName,
        'Email': order.email,
        'Phone Number': order.phoneNumber,
        'Family Members': order.familyMembers.toString(),
        'Travel Date': new Date(order.travelDate).toLocaleDateString(),
        'Duration (Days)': order.durationInDays.toString(),
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
        'Package Price Type': subscription.packagePrice,
        'Subscription Date': new Date(subscription.createdAt).toLocaleDateString(),
      }));
      fileName = `umrah-subscriptions-${new Date().toISOString().split('T')[0]}`;
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
   

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    workbook.Props = {
      Title: fileName,
      Subject: "Umrah Bookings Data",
      Author: "Travel Agency",
      CreatedDate: new Date()
    };

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