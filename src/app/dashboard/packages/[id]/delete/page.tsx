

import { deleteTravelPackage } from "@/action";
import { SubmitButton } from "@/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { unstable_noStore } from "next/cache";
import Link from "next/link";


async function getData(packageId: string) {
  const data = await prisma.travelPackage.findUnique({
    where: {
      id: packageId,
    },
    select: {
        images: true
    }
  });

  return data;

}

export default async function DeleteRoute({ params }: { params: { id: string } }) {

  unstable_noStore(); 
  const data = await getData(params.id);
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            product and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/packages">Cancel</Link>
          </Button>
          <form action={deleteTravelPackage}>
            <input type="hidden" name="packageId" value={params.id} />
            <input type="hidden" name="images" value={(data?.images)} />
            <SubmitButton variant="destructive" text="Delete Product" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}