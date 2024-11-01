"use client";

import {  createCarouselCountry } from "@/action";

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

// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { UploadDropzone } from "@/lib/uploadthing";
import { countriesSchema } from "@/lib/zodSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";
// import { useFormState } from "react-dom";

export default function BannerRoute() {
//   const [image, setImages] = useState<string | undefined>(undefined);


  const [form, fields] = useForm({
    // lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: countriesSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={createCarouselCountry}>
      <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/CarouselCountries">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Banner</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Create Country</CardTitle>
          <CardDescription>Create your Country right here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.name.id}>Name</Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              type="text"
            
              placeholder="Enter city name"
            />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>

           
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Country" />
        </CardFooter>
      </Card>
    </form>
  );
}