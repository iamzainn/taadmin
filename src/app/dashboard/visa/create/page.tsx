"use client";


import { createVisa } from "@/action";
import { SubmitButton } from "@/components/SubmitButtons";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { UploadDropzone } from "@/lib/uploadthing";
import { visaSchema } from "@/lib/zodSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";


export const dynamic = 'force-dynamic';

interface Agent {
  id: string;
  name: string;
}

export default function VisaCreateRoute() {
  const [images, setImages] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [, action] = useFormState(createVisa, undefined);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: visaSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch("/api/agents");
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        setAgents(data);
      }
    };

    fetchAgents();
  }, []);

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/visa">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Visa</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Visa Details</CardTitle>
          <CardDescription>Create a new visa entry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            {/* Country Name */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="countryName">Country Name</Label>
              <Input
                id="countryName"
                name={fields.countryName.name}
                defaultValue={fields.countryName.initialValue}
                placeholder="Enter country name"
              />
              {fields.countryName.errors && (
                <p className="text-red-500">{fields.countryName.errors}</p>
              )}
            </div>

            
            <div className="flex flex-col gap-3">
              <Label htmlFor="requiredDocuments">Required Documents</Label>
              <Textarea
                id="requiredDocuments"
                name={fields.requiredDocuments.name}
                defaultValue={fields.requiredDocuments.initialValue}
                placeholder="List required documents"
                rows={4}
              />
              {fields.requiredDocuments.errors && (
                <p className="text-red-500">{fields.requiredDocuments.errors}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name={fields.description.name}
                defaultValue={fields.description.initialValue}
                placeholder="Enter visa description"
                rows={4}
              />
              {fields.description.errors && (
                <p className="text-red-500">{fields.description.errors}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                name={fields.pricing.name}
                defaultValue={fields.pricing.initialValue}
                type="number"
                min={0}
                placeholder="Enter pricing in rupees"
              />
              {fields.pricing.errors && (
                <p className="text-red-500">{fields.pricing.errors}</p>
              )}
            </div>

            {/* Visa Validity */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="visaValidity">Visa Validity (in days)</Label>
              <Input
                id="visaValidity"
                name={fields.visaValidity.name}
                defaultValue={fields.visaValidity.initialValue}
                type="number"
                placeholder="Enter visa validity in days"
              />
              {fields.visaValidity.errors && (
                <p className="text-red-500">{fields.visaValidity.errors}</p>
              )}
            </div>

            {/* Agent Selection */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="agentId" id={Math.random().toString()}>Agent</Label>
              <Select name={fields.agentId.name}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fields.agentId.errors && (
                <p className="text-red-500">{fields.agentId.errors}</p>
              )}
            </div>

            {/* Images */}
            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input
                type="hidden"
                value={images}
                name={fields.images.name}
                defaultValue={fields.images.initialValue as string[]}
              />
              {images.length > 0 ? (
                <div className="flex gap-5">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        height={100}
                        width={100}
                        src={image}
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDelete(index)}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <UploadDropzone
                  endpoint="visaImageRoute"
                  className="object-cover border rounded-lg bg-gray-600 flex items-center justify-center"
                  onClientUploadComplete={(res) => {
                    setImages(res.map((r) => r.url));
                  }}
                  onUploadError={() => {
                    alert("Something went wrong");
                  }}
                />
              )}
              <p className="text-red-500">{fields.images.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Visa" />
        </CardFooter>
      </Card>
    </form>
  );
}