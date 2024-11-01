

import { deleteBanner } from "@/action";
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
import { unstable_noStore } from 'next/cache'


 const getData = async (bannerId: string) => {
  const banner = await prisma.banner.findUnique({
    where: {
      id: bannerId,
    },

    select: {
        imageString: true,
    }

    
    }
  )
  
  return banner
}

export default async function DeleteBannerRoute({
  params,
}: {
  params: { id: string };
})

{
   unstable_noStore();
  const data = await getData(params.id);
  const imageString = data?.imageString

  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            banner and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/banner">Cancel</Link>
          </Button>
          <form action={deleteBanner}>
            <input type="hidden" name="bannerId" value={params.id} />
            <input type="hidden" name="image" value={imageString} />
            <SubmitButton variant="destructive" text="Delete Product" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}