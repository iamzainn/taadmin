

import { deleteVisa } from "@/action";
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
import Link from "next/link";

async function getData(visaId: string) {
  const data = await prisma.visa.findUnique({
    where: {
      id: visaId,
    },
    select: {
        images: true
    }
  });

  return data;

}

export default async function DeleteRoute({ params }: { params: { id: string } }) {
    const data = await getData(params.id);
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            visa and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/visa">Cancel</Link>
          </Button>
          <form action={deleteVisa}>
            <input type="hidden" name="visaId" value={params.id} />
            <input type="hidden" name="images" value={(data?.images)} />
            <SubmitButton variant="destructive" text="Delete visa" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}