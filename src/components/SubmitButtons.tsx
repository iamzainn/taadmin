"use client";

import { Button } from "@/components/ui/button";
import { Loader2,  Plus, ShoppingBag,MinusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

interface buttonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={variant}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button variant={variant} type="submit">
          {text}
        </Button>
      )}
    </>
  );
}

export function ShoppingBagButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button size="lg" className="w-full mt-5" type="submit">
          <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
        </Button>
      )}
    </>
  );
}

export function Add() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="sm" className="w-full mt-5">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" />
        </Button>
      ) : (
        <Button size="sm" className="w-full mt-5 items-center" type="submit">
          <Plus className="mr-4 h-5 w-5" />
        </Button>
      )}
    </>
  );
}

export function Minus() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="sm" className="w-full mt-5">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" />
        </Button>
      ) : (
        <Button size="sm" className="w-full mt-5 text-center" type="submit">
         <MinusIcon className="mr-4 h-5 w-5" />
        </Button>
      )}
    </>
  );
}






export function DeleteItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-primary text-end">
          Removing...
        </button>
      ) : (
        <Button type="submit" className="font-medium text-primary text-end text-white">
          Delete
        </Button>
      )}
    </>
  );
}

export function ChceckoutButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-5">
          Checkout
        </Button>
      )}
    </>
  );
}