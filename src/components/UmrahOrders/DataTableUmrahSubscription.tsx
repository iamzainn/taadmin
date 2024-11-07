// components/UmrahOrders/DataTableUmrahSubscription.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { UmrahPackageSubscription } from "@/lib/types/umrah";
import { format } from 'date-fns';

interface DataTableUmrahSubscriptionProps {
  data: UmrahPackageSubscription[];
  onDataChange: () => void;
}

export function DataTableUmrahSubscription({ data, onDataChange }: DataTableUmrahSubscriptionProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Price Type</TableHead>
            <TableHead>Subscription Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{`${subscription.firstName} ${subscription.lastName}`}</TableCell>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>{subscription.phoneNumber}</TableCell>
              <TableCell>{subscription.country}</TableCell>
              <TableCell>{subscription.UmrahPackage.title}</TableCell>
              <TableCell>{subscription.packagePrice}</TableCell>
              <TableCell>{format(new Date(subscription.createdAt), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}