import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackageSubscriptions from "./PackageSubscription";
import CustomTravelOrders from "./CusomTravelOrders";

export default function TravelOrderTabs() {
  return (
    <Tabs defaultValue="customOrders">
      <TabsList>
        <TabsTrigger value="customOrders">Custom Travel Orders</TabsTrigger>
        <TabsTrigger value="packageSubscriptions">Travel Packages Customer Subscription</TabsTrigger>
      </TabsList>

      <TabsContent value="customOrders">
        <CustomTravelOrders />
      </TabsContent>
      
      <TabsContent value="packageSubscriptions">
        <PackageSubscriptions />
      </TabsContent>
    </Tabs>
  );
}