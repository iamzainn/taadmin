import { createAgent } from "@/action";
import { AgentForm } from "@/components/AgentForm";


export default function CreateAgentPage() {
  return <AgentForm action={createAgent} />;
}