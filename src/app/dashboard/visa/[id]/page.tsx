import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import EditVisaForm from "@/components/EditVisaForm";

async function getData(visaId: string) {
  const data = await prisma.visa.findUnique({
    where: {
      id: visaId,
    },

    include:{
        Agent: true
    }
    }

  );

  if (!data) {
    return notFound();
  }

  return {
  id:data.id,
  agentName:data.Agent.name,
  agentEmail:data.Agent.email,
  agentId:data.agentId,
  agentPhone:data.Agent.phone,
  countryName: data.countryName,
  description: data.description,
  pricing: data.pricing,
  requiredDocuments: data.requiredDocuments,
  visaValidity: data.visaValidity,
  images: data.images,

    
  };
}

export const dynamic = "force-dynamic";

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  return <EditVisaForm  data={data} />;
}