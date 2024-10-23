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
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButtons";
import { createTravelPackage } from "@/action";
import { Switch } from "@/components/ui/switch";

const PACKAGE_CATEGORIES = [
  "Student Adventure Tours",
  "Hot Deals Tours",
  "Luxury Travel Packages",
  "Religious/Pilgrimage Tours",
  "Honeymoon Packages",
] as const;

export default function CreateTravelPackagePage() {
  const [images, setImages] = useState<string[]>([]);
  const [dailyDetails, setDailyDetails] = useState<string[]>([""]);
  const [lastResult, action] = useFormState(createTravelPackage, undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("");
  const [overview, setOverview] = useState<string>("");

  const handleCategoryChange = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setSelectedCategories(
      selectedCategories.filter((cat) => cat !== categoryToRemove)
    );
  };

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: travelPackageSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    const durationValue = parseInt(fields.durationInDays.value || "1", 10);
    setDailyDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      if (durationValue > newDetails.length) {
        return [
          ...newDetails,
          ...Array(durationValue - newDetails.length).fill(""),
        ];
      } else if (durationValue < newDetails.length) {
        return newDetails.slice(0, durationValue);
      }
      return newDetails;
    });
  }, [fields.durationInDays.value]);

  const handleDailyDetailChange = (index: number, value: string) => {
    setDailyDetails((prevDetails) => {
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
      <div className="flex items-center gap-x-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/packages">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          New Travel Package
        </h1>
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
            <Label htmlFor={fields.price.id}>Price</Label>
            <Input
              id={fields.price.id}
              name={fields.price.name}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter package price"
            />
            <p className="text-red-500">{fields.price.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.overview.id}>Overview</Label>
            <Textarea
              id={fields.overview.id}
              name={fields.overview.name}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Enter package overview"
            />
            <p className="text-red-500">{fields.overview.errors}</p>
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
            <Label htmlFor={fields.departureFrom.id}>Departure City</Label>
            <Input
              id={fields.departureFrom.id}
              name={fields.departureFrom.name}
              defaultValue={fields.departureFrom.initialValue}
              placeholder="Enter departure city"
            />
            <p className="text-red-500">{fields.departureFrom.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor={fields.arrival.id}>Arrival City</Label>
            <Input
              id={fields.arrival.id}
              name={fields.arrival.name}
              defaultValue={fields.arrival.initialValue}
              placeholder="Enter arrival city"
            />
            <p className="text-red-500">{fields.arrival.errors}</p>
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
                  onChange={(e) =>
                    handleDailyDetailChange(index, e.target.value)
                  }
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
            <Label>Featured Product</Label>
            <Switch
              key={fields.isFeatured.key}
              name={fields.isFeatured.name}
            />
            <p className="text-red-500">{fields.isFeatured.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Package Categories</Label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="hover:bg-primary/20 rounded-full p-1"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedCategories.length < PACKAGE_CATEGORIES.length && (
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      handleCategoryChange(value);
                      e.target.value = ""; // Reset select after selection
                    }
                  }}
                  value=""
                >
                  <option value="">Select a category</option>
                  {PACKAGE_CATEGORIES.filter(
                    (cat) => !selectedCategories.includes(cat)
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="hidden"
                name={fields.categories.name}
                value={JSON.stringify(selectedCategories)}
              />
            </div>
            <p className="text-red-500">{fields.categories.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Images</Label>
            <input
              type="hidden"
              value={JSON.stringify(images)}
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
          <SubmitButton text="Create Travel Package" />
        </CardFooter>
      </Card>
    </form>
  );
}