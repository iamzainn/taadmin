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
import { TravelCustomBooking } from "@prisma/client"
import { format } from "date-fns"

interface DataTableProps {
  data: TravelCustomBooking[]
}

export function DataTableCustomTravel({ data }: DataTableProps) {
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
            <TableHead>FORM FILL DATE</TableHead>
           
            
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