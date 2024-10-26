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





interface DataTableProps {
  data: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    familyMembers: number;
    travelDate: Date;
    durationInDays: number;
    transportNeeded: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[] | undefined
}

export function DataTableCustomUmrah({ data }: DataTableProps) {
 

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
               <TableHead>Family members</TableHead>
              <TableHead>Transport needed</TableHead>  
              
              
              
             
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.fullName}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phoneNumber}</TableCell>
                  <TableCell>{booking.familyMembers}</TableCell>
                  <TableCell>{booking.transportNeeded == true ? "yes":"no"}</TableCell>
                 
                 
                  
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
      
    </>
  )
}