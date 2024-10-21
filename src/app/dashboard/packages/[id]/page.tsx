import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { EditForm } from "@/components/EditTravelForm";



async function getData(productId: string) {
  const data = await prisma.travelPackage.findUnique({
    where: {
      id: productId,
    },
  });

  if (!data) {
    return notFound();
  }

  return {
    ...data,
    
  };
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
   console.log(data);

  return <EditForm data={data} />;
}