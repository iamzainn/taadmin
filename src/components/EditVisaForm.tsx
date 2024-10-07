"use client";

import { visaSchema } from "@/lib/zodSchema";
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
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { deleteImage, editVisa } from "@/action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Agent {
  id: string;
  name: string;
}

interface VisaEditFormProps {
  data: {
    id: string;
    agentId: string;
    countryName: string;
    description: string;
    pricing: number;
    requiredDocuments: string;
    visaValidity: number;
    images: string[];
  }
}

export default function VisaEditForm({ data }: VisaEditFormProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [, action] = useFormState(editVisa, undefined);

  const [form, fields] = useForm({
    lastResult: null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: visaSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      countryName: data.countryName,
      description: data.description,
      pricing: data.pricing.toString(),
      requiredDocuments: data.requiredDocuments,
      visaValidity: data.visaValidity.toString(),
      agentId: data.agentId,
    },
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAgents(data);
        } else {
          console.error("Failed to fetch agents:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const handleDelete = async (imageUrl: string) => {
    const result = await deleteImage(imageUrl);
    if (result.status === "success") {
      setImages((prev) => prev.filter((url) => url !== imageUrl));
    }
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="visaId" value={data.id} />
      <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/visa">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Visa</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Visa Details</CardTitle>
          <CardDescription>Edit visa entry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
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

            <div className="flex flex-col gap-3">
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                name={fields.pricing.name}
                defaultValue={fields.pricing.initialValue}
                type="number"
                placeholder="Enter pricing in rupees"
              />
              {fields.pricing.errors && (
                <p className="text-red-500">{fields.pricing.errors}</p>
              )}
            </div>

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

            <div className="flex flex-col gap-3">
              <Label htmlFor="agentId">Agent</Label>
              <Select name={fields.agentId.name} defaultValue={data.agentId}>
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

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input
                type="hidden"
                value={images.join(',')}
                name={fields.images.name}
              />
              {images.length > 0 ? (
                <div className="flex gap-5">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        height={100}
                        width={100}
                        src={image}
                        alt="Visa Image"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleDelete(image)}
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
              {fields.images.errors && (
                <p className="text-red-500">{fields.images.errors}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update Visa" />
        </CardFooter>
      </Card>
    </form>
  );
}