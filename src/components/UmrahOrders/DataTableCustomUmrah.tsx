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
import { CustomUmrahPackages } from "@prisma/client"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import DetailsDialog from "./DetailsDialog"

interface DataTableProps {
  data: CustomUmrahPackages[]
}

export function DataTableCustomUmrah({ data }: DataTableProps) {
  const [selectedItem, setSelectedItem] = React.useState<CustomUmrahPackages | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.CustomerName}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phoneNumber}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>{booking.hotelName}</TableCell>
                  <TableCell>{format(new Date(booking.checkIn), 'PP')}</TableCell>
                  <TableCell>{format(new Date(booking.checkOut), 'PP')}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedItem(booking)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DetailsDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  )
}