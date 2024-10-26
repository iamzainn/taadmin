import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UmrahPackageSubscriptions from "./UmrahPackageSubscriptions";
import CustomUmrahOrders from "./CustomUmrahTabs";

export default function UmrahOrderTabs() {
  console.log("UmrahOrderTabs")

  return (
    <Tabs defaultValue="customOrders">
      <TabsList>
        <TabsTrigger value="customOrders">Custom Umrah Orders</TabsTrigger>
        <TabsTrigger value="packageSubscriptions">Umrah Package Subscriptions</TabsTrigger>
      </TabsList>

      <TabsContent value="customOrders">
        <CustomUmrahOrders searchParams={{}}  />
      </TabsContent>
      
      <TabsContent value="packageSubscriptions">
        <UmrahPackageSubscriptions searchParams={{}} />
      </TabsContent>
    </Tabs>
  );
}