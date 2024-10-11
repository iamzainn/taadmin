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
  image: string | null;
  inclusions: string[];
  Double_Price: bigint;
  Quad_Price: bigint;
  Sharing_Price: bigint;
  Triple_Price: bigint;
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
    defaultValue: {
      title: initialData.title || "",
      description: initialData.description || "",
      hotelMakkah: initialData.hotelMakkah || "",
      hotelMakkahRating: initialData.hotelMakkahRating || 0,
      hotelMadinah: initialData.hotelMadinah || "",
      hotelMadinahRating: initialData.hotelMadinahRating || 0,
      nightsInMakkah: initialData.nightsInMakkah || 0,
      image: initialData.image || "",
      inclusions: initialData.inclusions || [],
      nightsInMadinah: initialData.nightsInMadinah || 0,
      Double_Price: Number(initialData.Double_Price) || 0,
      Quad_Price: Number(initialData.Quad_Price) || 0,
      Sharing_Price: Number(initialData.Sharing_Price) || 0,
      Triple_Price: Number(initialData.Triple_Price) || 0,

     

    }
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
      <input type="hidden" name="packageId" value={initialData.id} />
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
          <CardDescription>Edit your Umrah package here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.title.id}>Package Title</Label>
            <Input
              id={fields.title.id}
              name={fields.title.name}
             defaultValue={initialData.title}
              placeholder="Enter package title"
            />
            <p className="text-red-500">{fields.title.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.description.id}>Description</Label>
            <Textarea
              id={fields.description.id}
              name={fields.description.name}
              defaultValue={initialData.description}
              
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
                defaultValue={initialData.hotelMakkah}
                
                placeholder="Enter hotel name in Makkah"
              />
              <p className="text-red-500">{fields.hotelMakkah.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMakkahRating.id}>Hotel Rating in Makkah</Label>
              <Input
                id={fields.hotelMakkahRating.id}
                name={fields.hotelMakkahRating.name}
                defaultValue={initialData.hotelMakkahRating}
               
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
                defaultValue={initialData.hotelMadinah}
                
                placeholder="Enter hotel name in Madinah"
              />
              <p className="text-red-500">{fields.hotelMadinah.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.hotelMadinahRating.id}>Hotel Rating in Madinah</Label>
              <Input
                id={fields.hotelMadinahRating.id}
                name={fields.hotelMadinahRating.name}
                defaultValue={initialData.hotelMadinahRating}
                
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
                defaultValue={initialData.nightsInMakkah}
               
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
                defaultValue={initialData.nightsInMadinah}
                
                type="number"
                min="1"
              />
              <p className="text-red-500">{fields.nightsInMadinah.errors}</p>
            </div>
          </div>

         

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.Double_Price.id}>Double Price</Label>
            <Input
              id={fields.Double_Price.id}
              name={fields.Double_Price.name}
              type="number"
              min="1"
              defaultValue={Number(initialData.Double_Price.toString())}
              
              placeholder="Enter price"
            />
            <p className="text-red-500">{fields.Double_Price.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.Quad_Price.id}>Quad Price</Label>
            <Input
              id={fields.Quad_Price.id}
              name={fields.Quad_Price.name}
              type="number"
              min="1"
              defaultValue={Number(initialData.Quad_Price.toString())}
              
              placeholder="Enter price"
            />
            <p className="text-red-500">{fields.Quad_Price.errors}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.Sharing_Price.id}>Sharing Price</Label>
            <Input
              id={fields.Sharing_Price.id}
              name={fields.Sharing_Price.name}
              type="number"
              min="1"
              defaultValue={Number(initialData.Sharing_Price.toString())}
              
              placeholder="Enter price"
            />
            <p className="text-red-500">{fields.Sharing_Price.errors}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.Triple_Price.id}>Triple Price</Label>
            <Input
              id={fields.Triple_Price.id}
              name={fields.Triple_Price.name}
              type="number"
              min="1"
              defaultValue={Number(initialData.Triple_Price.toString())}
              
              placeholder="Enter price"
            />
            <p className="text-red-500">{fields.Triple_Price.errors}</p>
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
                  onClick={() => handleDelete(image)}
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
          <SubmitButton text="Update Umrah Package" />
        </CardFooter>
      </Card>
    </form>
  );
}