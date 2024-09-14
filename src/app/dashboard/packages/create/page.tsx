"use client";

import { travelPackageSchema } from "@/lib/zodSchema";

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
import { ChevronLeft, Plus, Minus, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButtons";
import { createTravelPackage } from "@/action";

export default function CreateTravelPackagePage() {
  const [images, setImages] = useState<string[]>([""]);
  const [lastResult, action] = useFormState(createTravelPackage, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: travelPackageSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

 

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/packages">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Travel Package</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Package Details</CardTitle>
          <CardDescription>Create your travel package here</CardDescription>
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
            {fields.dailyDetails.getFieldList().map((field, index) => (
              <div key={field.key} className="flex items-center gap-2">
                <Textarea
                  name={field.name}
                  defaultValue={field.initialValue}
                  placeholder={`Enter details for day ${index + 1}`}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {}}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {}}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Day
            </Button>
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
              />
            <p className="text-red-500">{fields.price.errors}</p>
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
          <SubmitButton text="Create Travel Package" />
        </CardFooter>
      </Card>
    </form>
  );
}