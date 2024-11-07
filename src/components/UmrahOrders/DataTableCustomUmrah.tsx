'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
 
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";
import { CustomUmrahOrder } from "@/lib/types/umrah";
import { format } from 'date-fns';
import { deleteUmrahCustomOrder } from "@/action";
import { DeleteButton } from "../TravelOrders/DeleteButton";


interface DataTableCustomUmrahProps {
  data: CustomUmrahOrder[];
  onDataChange: () => Promise<void>;
}

export function DataTableCustomUmrah({ data, onDataChange }: DataTableCustomUmrahProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Family Members</TableHead>
            <TableHead>Travel Date</TableHead>
            <TableHead>Duration (Days)</TableHead>
            <TableHead>Transport</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.fullName}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>{order.phoneNumber}</TableCell>
              <TableCell>{order.familyMembers}</TableCell>
              <TableCell>{format(new Date(order.travelDate), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{order.durationInDays} days</TableCell>
              <TableCell>{order.transportNeeded ? 'Yes' : 'No'}</TableCell>
              <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Export Data</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                  <DeleteButton
                    id={order.id}
                    onDelete={deleteUmrahCustomOrder}
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