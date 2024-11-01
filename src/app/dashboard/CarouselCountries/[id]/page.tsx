import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { EditCountriesForm } from "@/components/EditCountriesForm";




async function getData(id: string) {
  const data = await prisma.countries.findUnique({
    where: {
      id: id,
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

  return <EditCountriesForm data={data} />;
}