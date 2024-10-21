import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';


async function getPackages() {
  const packages = await prisma.travelPackage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return packages;
}

export default async function PackagesRoute() {
  noStore();
  const packages = await getPackages();

  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild className="flex gap-x-2">
          <Link href="/dashboard/packages/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Package</span>
          </Link>
        </Button>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Travel Packages</CardTitle>
          <CardDescription>Manage your travel packages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>PKR {pkg.price.toString()}</TableCell>
                  <TableCell>{pkg.durationInDays} days</TableCell>
                  <TableCell>{pkg.arrival|| 'N/A'}</TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/packages/${pkg.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/packages/${pkg.id}/delete`}>
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}