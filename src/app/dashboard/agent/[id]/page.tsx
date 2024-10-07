// app/dashboard/agent/[id]/page.tsx

import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { AgentForm } from "@/components/AgentForm";
import { updateAgent } from "@/action";
import prisma from "@/lib/db";


async function getData(agentId: string) {
  const data = await prisma.agent.findUnique({
    where: {
      id: agentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!data) {
    notFound();
  }

  return data;
}

export default async function EditAgentPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  
  return <AgentForm data={data} action={updateAgent} />;
}