// app/dashboard/umrah-packages/create/page.tsx
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
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { createUmrahPackage } from "@/action";

export default function CreateUmrahPackagePage() {
  const [image, setImage] = useState<string | null>(null);
  const [inclusions, setInclusions] = useState<string[]>([""]);
  const [lastResult, action] = useFormState(createUmrahPackage, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: umrahPackageSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleInclusionChange = (index: number, value: string) => {
    setInclusions(prevInclusions => {
      const newInclusions = [...prevInclusions];
      newInclusions[index] = value;
      return newInclusions;
    });
  };

  const addInclusion = () => {
    setInclusions(prev => [...prev, ""]);
  };

  const removeInclusion = (index: number) => {
    setInclusions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/umrah-packages">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Umrah Package</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Umrah Package Details</CardTitle>
          <CardDescription>Create your Umrah package here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.title.id}>Package Title</Label>
            <Input
              id={fields.title.id}
              name={fields.title.name}
             
              placeholder="Enter package title"
            />
            <p className="text-red-500">{fields.title.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.description.id}>Description</Label>
            <Textarea
              id={fields.description.id}
              name={fields.description.name}
              
              placeholder="Enter package description"
            />
            <p className="text-red-500">{fields.description.errors}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMakkah.id}>Hotel in Makkah</Label>
              <Input
                id={fields.hotelMakkah.id}
                name={fields.hotelMakkah.name}
                
                placeholder="Enter hotel name in Makkah"
              />
              <p className="text-red-500">{fields.hotelMakkah.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMakkahRating.id}>Hotel Rating in Makkah</Label>
              <Input
                id={fields.hotelMakkahRating.id}
                name={fields.hotelMakkahRating.name}
               
                type="number"
                min="1"
                max="5"
              />
              <p className="text-red-500">{fields.hotelMakkahRating.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMadinah.id}>Hotel in Madinah</Label>
              <Input
                id={fields.hotelMadinah.id}
                name={fields.hotelMadinah.name}
                
                placeholder="Enter hotel name in Madinah"
              />
              <p className="text-red-500">{fields.hotelMadinah.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMadinahRating.id}>Hotel Rating in Madinah</Label>
              <Input
                id={fields.hotelMadinahRating.id}
                name={fields.hotelMadinahRating.name}
                
                type="number"
                min="1"
                max="5"
              />
              <p className="text-red-500">{fields.hotelMadinahRating.errors}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.nightsInMakkah.id}>Nights in Makkah</Label>
              <Input
                id={fields.nightsInMakkah.id}
                name={fields.nightsInMakkah.name}
               
                type="number"
                min="1"
              />
              <p className="text-red-500">{fields.nightsInMakkah.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.nightsInMadinah.id}>Nights in Madinah</Label>
              <Input
                id={fields.nightsInMadinah.id}
                name={fields.nightsInMadinah.name}
                
                type="number"
                min="1"
              />
              <p className="text-red-500">{fields.nightsInMadinah.errors}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id={fields.transportation.id}
              name={fields.transportation.name}
              defaultChecked={fields.transportation.value ? true : false}
            />
            <Label htmlFor={fields.transportation.id}>Transportation Included</Label>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.price.id}>Price</Label>
            <Input
              id={fields.price.id}
              name={fields.price.name}
              
              type="number"
              min="1"
              step="0.01"
            />
            <p className="text-red-500">{fields.price.errors}</p>
          </div>

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
            <input
              type="hidden"
              name={fields.inclusions.name}
              value={JSON.stringify(inclusions)}
            />
            <p className="text-red-500">{fields.inclusions.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Package Image</Label>
            <input
              type="hidden"
              name={fields.image.name}
              value={image || ""}
            />
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
                  onClick={() => setImage(null)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="packageImageRoute"
                onClientUploadComplete={(res) => {
                  setImage(res[0].url);
                }}
                onUploadError={() => {
                  alert("Image upload failed");
                }}
              />
            )}
            <p className="text-red-500">{fields.image.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Umrah Package" />
        </CardFooter>
      </Card>
    </form>
  );
}