'use client'

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { format } from "date-fns"
import { TravelOrder } from "@/lib/types"
import { DeleteButton } from "./DeleteButton"
import { deleteCustomOrder } from "@/action"

interface DataTableProps {
  data: TravelOrder[]
  onDataChange: () => void;
}

export function DataTableCustomTravel({ data ,onDataChange}: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Order</TableHead>
           
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((booking) => (
              <TableRow key={booking.id}>          
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.phoneNumber}</TableCell>
                <TableCell>{booking.country}</TableCell>
                <TableCell>{booking.Destination}</TableCell>
                <TableCell>{format(new Date(booking.createdAt), 'PP')}</TableCell>
                <TableCell>
                  <DeleteButton
                    id={booking.id}
                    onDelete={deleteCustomOrder}
                    onDeleteSuccess={onDataChange}
                  />
                </TableCell>
                
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}