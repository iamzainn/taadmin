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

import { UmrahPackageSubscription } from "@/lib/types/umrah";
import { format } from 'date-fns';
import { DeleteButton } from "../TravelOrders/DeleteButton";
import { deleteUmrahSubscription } from "@/action";


interface DataTableUmrahSubscriptionProps {
  data: UmrahPackageSubscription[];
  onDataChange: () => Promise<void>;
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
            <TableHead>Family Members</TableHead>
            <TableHead>Travel Date</TableHead>
            <TableHead>Transport</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                {`${subscription.firstName} ${subscription.lastName}`}
              </TableCell>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>{subscription.phoneNumber}</TableCell>
              <TableCell>{subscription.country}</TableCell>
              <TableCell>{subscription.UmrahPackage.title}</TableCell>
              <TableCell>{subscription.packagePriceType}</TableCell>
              <TableCell>{subscription.familyMembers}</TableCell>
              <TableCell>
                {format(new Date(subscription.travelDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {subscription.transportNeeded ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>
                {format(new Date(subscription.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => navigator.clipboard.writeText(subscription.id)}
                      >
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Export Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                  <DeleteButton
                    id={subscription.id}
                    onDelete={deleteUmrahSubscription}
                    onDeleteSuccess={onDataChange}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}