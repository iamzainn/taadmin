import { ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";


import { redirect } from "next/navigation";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { DashboardNavigation } from "@/components/DashboardNaviagation";


export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  noStore();


  const { sessionClaims } = auth()

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.metadata.role !== 'admin') {
    console.log("unauthorized")
    redirect('/')
  }


  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white">
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <DashboardNavigation />
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="shrink-0 md:hidden"
              variant="outline"
              size="icon"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-6 text-lg font-medium mt-5">
              <DashboardNavigation />
            </nav>
          </SheetContent>
        </Sheet>
         
             </header>
      <main className="my-5">{children}</main>
    </div>
  );
}