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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "./SubmitButtons";
import { travelPackageSchema } from "@/lib/zodSchema";
import { UploadDropzone } from "@/lib/uploadthing";
import { Decimal, JsonValue } from "@prisma/client/runtime/library";

import { editPackage } from "@/action";

interface EditTravelFormProps {
    data: {
      id: string;
      name: string;
      durationInDays: number;
      departureCity: string;
      arrivalCity: string;
      price: Decimal;
      images: string[];
      dailyDetails: JsonValue;
      overview: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
export function EditForm({ data }: EditTravelFormProps) {
    const [images, setImages] = useState<string[]>(data.images);
    const [dailyDetails, setDailyDetails] = useState<string[]>(data.dailyDetails as string[]);
    const [lastResult, action] = useFormState(editPackage, null);
  
    const [form, fields] = useForm({
      lastResult,
      onValidate({ formData }) {
        console.log(formData + "onvalidate")
        return parseWithZod(formData, { schema: travelPackageSchema });
      },
      
      shouldValidate: "onBlur",
      shouldRevalidate: "onInput",
    });

  useEffect(() => {
    const durationValue = parseInt(fields.durationInDays.value || "1", 10);
    setDailyDetails(prevDetails => {
      const newDetails = [...prevDetails];
      if (durationValue > newDetails.length) {
        return [...newDetails, ...Array(durationValue - newDetails.length).fill("")];
      } else if (durationValue < newDetails.length) {
        return newDetails.slice(0, durationValue);
      }
      return newDetails;
    });
  }, [fields.durationInDays.value]);

  const handleDailyDetailChange = (index: number, value: string) => {
    setDailyDetails(prevDetails => {
      const newDetails = [...prevDetails];
      newDetails[index] = value;
      return newDetails;
    });
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <input type="hidden" name="packageId" value={data.id} />
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/packages">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Travel Package</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Package Details</CardTitle>
          <CardDescription>Edit your travel package here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.name.id}>Package Name</Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              defaultValue={fields.name.initialValue}
              placeholder="Enter package name"
            />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.durationInDays.id}>Duration (days)</Label>
            <Input
              id={fields.durationInDays.id}
              name={fields.durationInDays.name}
              defaultValue={fields.durationInDays.initialValue}
              type="number"
              min="1"
            />
            <p className="text-red-500">{fields.durationInDays.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.departureCity.id}>Departure City</Label>
            <Input
              id={fields.departureCity.id}
              name={fields.departureCity.name}
              defaultValue={fields.departureCity.initialValue}
              placeholder="Enter departure city"
            />
            <p className="text-red-500">{fields.departureCity.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.arrivalCity.id}>Arrival City</Label>
            <Input
              id={fields.arrivalCity.id}
              name={fields.arrivalCity.name}
              defaultValue={fields.arrivalCity.initialValue}
              placeholder="Enter arrival city"
            />
            <p className="text-red-500">{fields.arrivalCity.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Daily Details</Label>
            {dailyDetails.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label htmlFor={`daily-detail-${index}`}>Day {index + 1}</Label>
                <Textarea
                  id={`daily-detail-${index}`}
                  name={`${fields.dailyDetails.name}[${index}]`}
                  value={detail}
                  onChange={(e) => handleDailyDetailChange(index, e.target.value)}
                  placeholder={`Enter details for day ${index + 1}`}
                />
              </div>
            ))}
            <input
              type="hidden"
              name={fields.dailyDetails.name}
              value={JSON.stringify(dailyDetails)}
            />
            <p className="text-red-500">{fields.dailyDetails.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.overview.id}>Overview</Label>
            <Textarea
              id={fields.overview.id}
              name={fields.overview.name}
              defaultValue={fields.overview.initialValue}
              placeholder="Enter package overview"
            />
            <p className="text-red-500">{fields.overview.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.price.id}>Pricing</Label>
            <Input
              id={fields.price.id}
              name={fields.price.name}
              defaultValue={fields.price.initialValue}
              type="number"
              min="1"
              step="0.01"
            />
            <p className="text-red-500">{fields.price.errors}</p>
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
                endpoint="packageImageRoute"
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
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update Travel Package" />
        </CardFooter>
      </Card>
    </form>
  );
}