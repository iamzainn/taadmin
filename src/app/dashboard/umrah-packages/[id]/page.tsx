// app/dashboard/umrah-packages/[id]/page.tsx
import { UmrahPackageForm } from "../../../../components/umrah/UmrahPackageForm"
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUmrahPackage(id: string) {
  const umrahPackage = await prisma.umrahPackage.findUnique({
    where: { id },
  });

  if (!umrahPackage) notFound();

  return umrahPackage;
}

export default async function EditUmrahPackagePage({
  params,
}: {
  params: { id: string };
}) {
  const umrahPackage = await getUmrahPackage(params.id);

  return <UmrahPackageForm initialData={umrahPackage} />;
}