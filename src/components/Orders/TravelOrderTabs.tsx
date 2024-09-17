
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PackageSubscriptions from "./PackageSubscription";
import CustomTravelOrders from "./CusomTravelOrders";



export default function TravelOrderTabs() {
  return (
    
    <Tabs>
      <TabsList>
        <TabsTrigger value="customOrders">Custom Travel Orders</TabsTrigger>
        <TabsTrigger value="packageSubscriptions">Travel Packages Customer Subscription</TabsTrigger>
      </TabsList>

      <TabsContent value="customOrders">
        <CustomTravelOrders searchParams={{}}  />
      </TabsContent>
      
      <TabsContent value="packageSubscriptions">
        <PackageSubscriptions searchParams={{}} />
      </TabsContent>
    </Tabs>
  );
}