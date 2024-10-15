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
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Pick Up Location</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Travel Start Date</TableHead>
            <TableHead>Travel End Date</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((booking) => (
              <TableRow key={booking.id}>
                
                <TableCell>{booking.firstName}</TableCell>
                <TableCell>{booking.lastName}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.phoneNumber}</TableCell>
                <TableCell>{booking.country}</TableCell>
                <TableCell>{booking.pickUpLocation}</TableCell>
                <TableCell>{booking.Destination}</TableCell>
                <TableCell>{format(new Date(booking.travelStartDate), 'PP')}</TableCell>
                <TableCell>{format(new Date(booking.travelEndDate), 'PP')}</TableCell>
                
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