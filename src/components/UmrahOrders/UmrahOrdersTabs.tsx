// components/UmrahOrders/UmrahOrderTabs.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomUmrahOrders from "./CustomUmrahOrders";
import UmrahPackageSubscriptions from "./UmrahPackageSubscriptions";


export default function UmrahOrderTabs() {
  return (
    <Tabs defaultValue="customOrders">
      <TabsList>
        <TabsTrigger value="customOrders">Custom Umrah Orders</TabsTrigger>
        <TabsTrigger value="packageSubscriptions">Umrah Package Subscriptions</TabsTrigger>
      </TabsList>

      <TabsContent value="customOrders">
        <CustomUmrahOrders />
      </TabsContent>
      
      <TabsContent value="packageSubscriptions">
        <UmrahPackageSubscriptions />
      </TabsContent>
    </Tabs>
  );
}