// app/dashboard/agent/[id]/delete/page.tsx


import { deleteAgent } from "@/action";
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

import { unstable_noStore } from "next/cache";
import Link from "next/link";

async function getData(agentId: string) {
  const data = await prisma.agent.findUnique({
    where: {
      id: agentId,
    },
    select: {
      name: true,
    },
  });

  return data;
}

export default async function DeleteAgentPage({ params }: { params: { id: string } }) {
  unstable_noStore();
  const data = await getData(params.id);

  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the agent
            {data?.name && ` "${data.name}"`} and remove all associated data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/agent">Cancel</Link>
          </Button>
          <form action={deleteAgent}>
            <input type="hidden" name="agentId" value={params.id} />
            <SubmitButton variant="destructive" text="Delete Agent" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}