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

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "./SubmitButtons";
import { countriesSchema} from "@/lib/zodSchema";
import { updateCarouselCountry } from "@/action";


interface EditTravelFormProps {
  data: {
    id: string;
    name: string;
    
  };
}

export function EditCountriesForm({ data }: EditTravelFormProps) {


  const [form, fields] = useForm({
  
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: countriesSchema});
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
     name: data.name
    },
  });

 
  
 

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={updateCarouselCountry}>
      <input type="hidden" name="id" value={data.id} />
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/CarouselCountries">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          Edit Country
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Country Details</CardTitle>
          <CardDescription>Edit here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.name.id}> Name</Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              defaultValue={fields.name.initialValue}
              placeholder="Enter package name"
            />
            <p className="text-red-500">{fields.name.errors}</p>
          </div>

          
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update Country" />
        </CardFooter>
      </Card>
    </form>
  );
}