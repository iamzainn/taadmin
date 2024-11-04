import { createAgent } from "@/action";
import { AgentForm } from "@/components/AgentForm";
export const dynamic = "force-dynamic";
export default function CreateAgentPage() {
  return <AgentForm action={createAgent} />;
}