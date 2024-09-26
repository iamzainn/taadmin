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
import { useState } from "react";

import { useFormState } from "react-dom";
import { deleteImage, editVisa } from "@/action";

interface VisaEditFormProps {
    data:{
      id: string;
      agentName: string;
      agentEmail: string;
      agentId: string;
      agentPhone: string;
      countryName: string;
      description: string;
      pricing: number;
      requiredDocuments: string;
      visaValidity: number;
      images: string[];

      
    }
}


export default function VisaEditForm({data}: VisaEditFormProps) {
  const [images, setImages] = useState<string[]>(data.images)

  const [, action] = useFormState(editVisa, undefined);


const [form, fields] = useForm({
    lastResult: null,
    onValidate({ formData }) {
      console.log(formData + "onvalidate")
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
        agentPhone: data.agentPhone,
        agentEmail: data.agentEmail,
        agentName: data.agentName,
    },
  });

  const handleDelete = async (imageUrl: string) => {
   const result= await deleteImage(imageUrl)

    if (result.status === "success") {
      setImages((prev) => prev.filter((url) => url !== imageUrl));
    }
  
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} >
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
                <p className="text-red-500">
                  {fields.requiredDocuments.errors}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.initialValue}
                placeholder="Enter visa description (optional)"
                rows={4}
              />
              {fields.description.errors && (
                <p className="text-red-500">{fields.description.errors}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="pricing">Pricing (in cents)</Label>
              <Input
                id="pricing"
                name={fields.pricing.name}
                key={fields.pricing.key}
                defaultValue={fields.pricing.initialValue}
                type="number"
                placeholder="Enter pricing in cents"
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
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                name={fields.agentName.name}
                defaultValue={fields.agentName.initialValue}
                placeholder="Enter agent name"
              />
              {fields.agentName.errors && (
                <p className="text-red-500">{fields.agentName.errors}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="agentPhone">Agent Phone</Label>
              <Input
                id="agentPhone"
                name={fields.agentPhone.name}
                defaultValue={fields.agentPhone.initialValue}
                placeholder="Enter agent phone number"
              />
              {fields.agentPhone.errors && (
                <p className="text-red-500">{fields.agentPhone.errors}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="agentEmail">Agent Email</Label>
              <Input
                id="agentEmail"
                name={fields.agentEmail.name}
                defaultValue={fields.agentEmail.initialValue}
                placeholder="Enter agent email"
                type="email"
              />
              {fields.agentEmail.errors && (
                <p className="text-red-500">{fields.agentEmail.errors}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <input
                type="hidden"
                value={images}
                key={fields.images.key}
                name={fields.images.name}
                defaultValue={fields.images.initialValue as undefined}
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
              <p className="text-red-500">{fields.images.errors}</p>
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


