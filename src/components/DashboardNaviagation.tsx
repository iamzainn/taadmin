"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "orders",
    href: "/dashboard/orders",
  },
  {
    name: "Packages",
    href: "/dashboard/packages",
  },
  {
    name: "Banner Picture",
    href: "/dashboard/banner",
  },
  { 
    name:"Visa",
    href:"/dashboard/visa"
   },
   {
    name:"Agent",
    href:"/dashboard/agent"
   }
];

export function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            link.href === pathname
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}