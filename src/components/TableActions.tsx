
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { TravelOrder, PackageSubscription } from '@/lib/types';

type CellStyle = {
  fill?: { fgColor: { rgb: string } };
  font?: { color?: { rgb: string }; bold?: boolean };
  alignment?: { horizontal: string };
};

type WorksheetColumn = {
  col: number;
  header: string | undefined;
};

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

  const applyExcelStyles = (worksheet: XLSX.WorkSheet) => {
    const { headerStyle, highlightedStyle, dateStyle } = createExcelStyles();
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[headerAddress]) continue;
      worksheet[headerAddress].s = headerStyle;
    }

    const highlightedColumns: WorksheetColumn[] = worksheet['!ref'] 
      ? Array.from({ length: range.e.c + 1 }, (_, i) => ({
          col: i,
          header: worksheet[XLSX.utils.encode_cell({ r: 0, c: i })]?.v?.toString()
        }))
      : [];

    for (let R = 1; R <= range.e.r; R++) {
      highlightedColumns.forEach(({ col, header }) => {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: col });
        if (!worksheet[cellAddress] || !header) return;

        if (
          header.includes('Phone') ||
          header.includes('Destination') ||
          header.includes('Name')
        ) {
          worksheet[cellAddress].s = highlightedStyle;
        } else if (
          header.includes('Date') ||
          header.includes('Travel')
        ) {
          worksheet[cellAddress].s = dateStyle;
        }
      });
    }

    const calculateColWidth = (wsData: unknown[][]): number[] => {
      const widths: number[] = [];
      wsData.forEach(row => {
        row.forEach((cell, i) => {
          const cellValue = String(cell);
          widths[i] = Math.max(widths[i] || 10, cellValue.length + 2);
        });
      });
      return widths;
    };

    if (worksheet['!ref']) {
      const wsData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });
      worksheet['!cols'] = calculateColWidth(wsData).map(width => ({ width }));
    }
  };

  const handleDownload = () => {
    if (data.length === 0) return;

    let worksheetData: Record<string, string>[] = [];
    let fileName: string;

    if (tableType === 'orders') {
      worksheetData = (data as TravelOrder[]).map(order => ({
        'Name': order.name,
        'Email': order.email,
        'Phone Number': order.phoneNumber,
        'Country': order.country,
        'Destination': order.Destination,
        'Order Date': new Date(order.createdAt).toLocaleDateString(),
      }));
      fileName = `travel-orders-${new Date().toISOString().split('T')[0]}`;
    } else {
      worksheetData = (data as PackageSubscription[]).map(subscription => ({
        'First Name': subscription.firstName,
        'Last Name': subscription.lastName,
        'Email': subscription.email,
        'Phone Number': subscription.phoneNumber,
        'Country': subscription.country,
        'Package Name': subscription.TravelPackage.name,
        'Travel Date': new Date(subscription.travelDate).toLocaleDateString(),
        'Destination': subscription.TravelPackage.arrival,
        'Subscription Date': new Date(subscription.createdAt).toLocaleDateString(),
      }));
      fileName = `package-subscriptions-${new Date().toISOString().split('T')[0]}`;
    }

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    applyExcelStyles(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    workbook.Props = {
      Title: fileName,
      Subject: "Travel Bookings Data",
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
