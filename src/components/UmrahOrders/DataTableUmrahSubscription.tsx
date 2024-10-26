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
import { UmrahPackageSubscription, UmrahPackage } from "@prisma/client"
// import { Button } from "@/components/ui/button"


interface DataTableProps {
  data: (UmrahPackageSubscription & { UmrahPackage: UmrahPackage })[]
}

export function DataTableUmrahSubscription({ data }: DataTableProps) {
  // const [selectedItem, setSelectedItem] = React.useState<(UmrahPackageSubscription & { UmrahPackage: UmrahPackage }) | null>(null);

  return (
    <>
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
              {/* <TableHead>Actions</TableHead> */}
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
                  <TableCell>{subscription.UmrahPackage.title}</TableCell>
                  {/* <TableCell>
                    <Button onClick={() => setSelectedItem(subscription)}>View Details</Button>
                  </TableCell> */}
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
      
    </>
  )
}