"use client";

import { createBanner } from "@/action";
import { bannerSchema } from "../../../../lib/zodSchema";
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
import { UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function BannerRoute() {
  const [image, setImages] = useState<string | undefined>(undefined);
  const [lastResult, action] = useFormState(createBanner, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bannerSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/banner">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Banner</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Create your banner right here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-3">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                type="text"
                placeholder="Create title for Banner"
              />
              <p className="text-red-500">{fields.title.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Sub Title</Label>
              <Input
                name={fields.subtitle.name}
                key={fields.subtitle.key}
                defaultValue={fields.subtitle.initialValue}
                type="text"
                placeholder="Create Subtitle for Banner"
              />
              <p className="text-red-500">{fields.subtitle.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Banner for</Label>
              <Select 
                name={fields.for.name}
                key={fields.for.key}
                defaultValue={fields.for.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select banner purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Visa">Visa</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.for.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Image</Label>
              <input
                type="hidden"
                value={image}
                key={fields.imageString.key}
                name={fields.imageString.name}
                defaultValue={fields.imageString.initialValue}
              />
              {image !== undefined ? (
                <Image
                  src={image}
                  alt="Product Image"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] object-cover border rounded-lg"
                />
              ) : (
                <UploadDropzone
                  // className="object-cover border rounded-lg bg-gray-600 flex items-center justify-center"
                  onClientUploadComplete={(res) => {
                    setImages(res[0].url);
                  }}
                  onUploadError={() => {
                    alert("Something went wrong");
                  }}
                  endpoint="bannerImageRoute"
                />
              )}

              <p className="text-red-500">{fields.imageString.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Banner" />
        </CardFooter>
      </Card>
    </form>
  );
}