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
import { PackageSubscription, TravelPackage } from "@prisma/client"


interface DataTableProps {
  data: (PackageSubscription & { TravelPackage: TravelPackage })[]
}

export function DataTablePackageSubscription({ data }: DataTableProps) {
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
            <TableHead>Package Name</TableHead>
            
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
                <TableCell>{subscription.TravelPackage.name}</TableCell>
              
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
  )
}