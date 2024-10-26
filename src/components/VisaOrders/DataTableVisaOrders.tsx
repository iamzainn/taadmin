'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { VisaOrder } from "@prisma/client"
import { format } from "date-fns"

interface DataTableProps {
  data: VisaOrder[]
}

export function DataTableVisaOrders({ data }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Number of Visas</TableHead>
            <TableHead>Travel Date</TableHead>
            <TableHead>Processing Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Application Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{order.nationality}</TableCell>
                <TableCell>{order.numberOfVisas}</TableCell>
                <TableCell>{format(new Date(order.travelDate), 'PP')}</TableCell>
                <TableCell>{order.processingType}</TableCell>
                <TableCell>{order.countryName}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No visa orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}