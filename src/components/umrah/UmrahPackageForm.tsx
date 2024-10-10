// components/UmrahPackageForm.tsx
"use client";
import { umrahPackageSchema } from "@/lib/zodSchema";
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
import { ChevronLeft, XIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButtons";

import { Checkbox } from "@/components/ui/checkbox";

import { deleteImage,  editUmrahPackage } from "@/action";

interface UmrahPackageFormProps {
  data:{
  id: string;
  title: string;
  description: string;
  hotelMakkah: string;
  hotelMakkahRating: number;
  hotelMadinah: string;
  hotelMadinahRating: number;
  nightsInMakkah: number;
  nightsInMadinah: number;
  transportation: boolean;
  price: bigint;
  image: string | null;
  inclusions: string[];
  createdAt: Date;
  updatedAt: Date;
  }
}

export function EditUmrahForm({ data: initialData }: UmrahPackageFormProps) {
  const [inclusions, setInclusions] = useState(initialData.inclusions || []);
  const [image, setImage] = useState(initialData.image);
  const [lastResult, action] = useFormState(editUmrahPackage, null);





  const handleDelete = async (imageUrl: string) => {
    const result= await deleteImage(imageUrl)
 
     if (result.status === "success") {
       setImage("");
     }
   
   };


  const [form, fields] = useForm({
    
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: umrahPackageSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: initialData || undefined,
  });

  const handleInclusionChange = (index: number, value: string) => {
    setInclusions((prev) => {
      const newInclusions = [...prev];
      newInclusions[index] = value;
      return newInclusions;
    });
  };

  const addInclusion = () => {
    setInclusions((prev) => [...prev, ""]);
  };

  const removeInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/umrah-packages">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          Edit Umrah Package
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> Edit Umrah Package</CardTitle>
          <CardDescription>
            Update your Umrah package
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
         
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.title.id}>Package Title</Label>
            <Input
              id={fields.title.id}
              name={fields.title.name}
              defaultValue={fields.title.value}
              placeholder="Enter package title"
            />
            {fields.title.errors && (
              <p className="text-red-500">{fields.title.errors}</p>
            )}
          </div>

          
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.description.id}>Description</Label>
            <Textarea
              id={fields.description.id}
              name={fields.description.name}
              defaultValue={fields.description.value}
              placeholder="Enter package description"
            />
            {fields.description.errors && (
              <p className="text-red-500">{fields.description.errors}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMakkah.id}>Hotel in Makkah</Label>
              <Input
                id={fields.hotelMakkah.id}
                name={fields.hotelMakkah.name}
                defaultValue={fields.hotelMakkah.value}
                placeholder="Enter hotel name in Makkah"
              />
              {fields.hotelMakkah.errors && (
                <p className="text-red-500">{fields.hotelMakkah.errors}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMakkahRating.id}>
                Hotel Rating in Makkah
              </Label>
              <Input
                id={fields.hotelMakkahRating.id}
                name={fields.hotelMakkahRating.name}
                defaultValue={fields.hotelMakkahRating.value}
                type="number"
                min="1"
                max="5"
              />
              {fields.hotelMakkahRating.errors && (
                <p className="text-red-500">{fields.hotelMakkahRating.errors}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMadinah.id}>Hotel in Madinah</Label>
              <Input
                id={fields.hotelMadinah.id}
                name={fields.hotelMadinah.name}
                defaultValue={fields.hotelMadinah.value}
                placeholder="Enter hotel name in Madinah"
              />
              {fields.hotelMadinah.errors && (
                <p className="text-red-500">{fields.hotelMadinah.errors}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMadinahRating.id}>
                Hotel Rating in Madinah
              </Label>
              <Input
                id={fields.hotelMadinahRating.id}
                name={fields.hotelMadinahRating.name}
                defaultValue={fields.hotelMadinahRating.value}
                type="number"
                min="1"
                max="5"
              />
              {fields.hotelMadinahRating.errors && (
                <p className="text-red-500">{fields.hotelMadinahRating.errors}</p>
              )}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.nightsInMakkah.id}>Nights in Makkah</Label>
              <Input
                id={fields.nightsInMakkah.id}
                name={fields.nightsInMakkah.name}
                defaultValue={fields.nightsInMakkah.value}
                type="number"
                min="1"
              />
              {fields.nightsInMakkah.errors && (
                <p className="text-red-500">{fields.nightsInMakkah.errors}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.nightsInMadinah.id}>Nights in Madinah</Label>
              <Input
                id={fields.nightsInMadinah.id}
                name={fields.nightsInMadinah.name}
                defaultValue={fields.nightsInMadinah.value}
                type="number"
                min="1"
              />
              {fields.nightsInMadinah.errors && (
                <p className="text-red-500">{fields.nightsInMadinah.errors}</p>
              )}
            </div>
          </div>

          {/* Transportation */}
          <div className="flex items-center gap-3">
            <Checkbox
              id={fields.transportation.id}
              name={fields.transportation.name}
              defaultChecked={fields.transportation.value ? true : false}
            />
            <Label htmlFor={fields.transportation.id}>
              Transportation Included
            </Label>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.price.id}>Price</Label>
            <Input
              id={fields.price.id}
              name={fields.price.name}
              defaultValue={fields.price.value}
              type="number"
              min="1"
            />
            {fields.price.errors && (
              <p className="text-red-500">{fields.price.errors}</p>
            )}
          </div>

          {/* Inclusions */}
          <div className="flex flex-col gap-3">
            <Label>Package Inclusions</Label>
            {inclusions.map((inclusion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={inclusion}
                  onChange={(e) => handleInclusionChange(index, e.target.value)}
                  placeholder={`Inclusion ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeInclusion(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInclusion}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Add Inclusion
            </Button>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-3">
            <Label>Package Image</Label>
            {image ? (
              <div className="relative w-full h-48">
                <Image
                  src={image}
                  alt="Package Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() =>handleDelete(image)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="umrahImageRoute"
                onClientUploadComplete={(res) => {
                  setImage(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  console.error(error);
                  alert("Upload failed");
                }}
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <input type="hidden" name="packageId" value={initialData?.id} />
          <SubmitButton text={ "Update Package" }/>
        </CardFooter>
      </Card>
    </form>
  );
}