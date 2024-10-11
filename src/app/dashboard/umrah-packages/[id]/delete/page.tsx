// app/dashboard/umrah-packages/[id]/delete/page.tsx
import { deleteUmrahPackage } from "@/action";
import { SubmitButton } from "@/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";




export default async function DeleteUmrahPackagePage({
  params,
}: {
  params: { id: string };
}) {


  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the Umrah
            package  and remove all associated data from
            our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/umrah-packages">Cancel</Link>
          </Button>
          <form action={deleteUmrahPackage}>
            <input type="hidden" name="id" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Package" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}