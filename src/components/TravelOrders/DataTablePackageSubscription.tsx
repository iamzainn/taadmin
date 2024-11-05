'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageSubscription } from '@/lib/types';
import { format } from "date-fns";
import { DeleteButton } from "./DeleteButton";
import { deletePackageSubscription } from "@/action";

interface DataTableProps {
  data: PackageSubscription[];
  onDataChange: () => void;
}

export function DataTablePackageSubscription({ data ,onDataChange}: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Package Name</TableHead>
            <TableHead>Destination</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.firstName}</TableCell>
                <TableCell>{subscription.lastName}</TableCell>
                <TableCell>{subscription.email}</TableCell>
                <TableCell>{subscription.phoneNumber}</TableCell>
                <TableCell>{subscription.country}</TableCell>
                <TableCell>{format(new Date(subscription.createdAt), 'PP')}</TableCell>
                <TableCell>{subscription.TravelPackage.name}</TableCell>
                <TableCell>{subscription.TravelPackage.arrival}</TableCell>
                <TableCell>
                  <DeleteButton
                    id={subscription.id}
                    onDelete={deletePackageSubscription}
                    onDeleteSuccess={onDataChange}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}