import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { EditForm } from "@/components/EditTravelForm";
import { Decimal } from "@prisma/client/runtime/library";

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
    price: data.price instanceof Decimal ? data.price : new Decimal(data.price),
  };
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  return <EditForm data={data} />;
}