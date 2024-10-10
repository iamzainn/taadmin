// app/dashboard/umrah-packages/[id]/page.tsx
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { EditUmrahForm } from "@/components/umrah/UmrahPackageForm";


async function getData(packageId: string) {
  const data = await prisma.umrahPackage.findUnique({
    where: {
      id: packageId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditUmrahRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  
  return <EditUmrahForm data={data } />;
}