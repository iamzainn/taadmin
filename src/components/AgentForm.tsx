// components/AgentForm.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "./SubmitButtons";
import { agentSchema, AgentSchemaType, ActionResult } from "@/lib/zodSchema";

interface AgentFormProps {
  data?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  action: (prevState: unknown, formData: FormData) => Promise<ActionResult>;
}

export function AgentForm({ data, action }: AgentFormProps) {
  const [lastResult, formAction] = useFormState(action, null);

  const [form, fields] = useForm<AgentSchemaType>({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: agentSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction}>
      {data && <input type="hidden" name="agentId" value={data.id} />}
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/agent">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          {data ? "Edit Agent" : "New Agent"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Details</CardTitle>
          <CardDescription>
            {data ? "Edit agent information" : "Create a new agent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.name.id}>Name</Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              defaultValue={fields.name.initialValue}
              placeholder="Enter agent name"
            />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.email.id}>Email</Label>
            <Input
              id={fields.email.id}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              type="email"
              placeholder="Enter agent email"
            />
            <p className="text-red-500">{fields.email.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.phone.id}>Phone</Label>
            <Input
              id={fields.phone.id}
              name={fields.phone.name}
              defaultValue={fields.phone.initialValue}
              placeholder="Enter agent phone number"
            />
            <p className="text-red-500">{fields.phone.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text={data ? "Update Agent" : "Create Agent"} />
        </CardFooter>
      </Card>
    </form>
  );
}