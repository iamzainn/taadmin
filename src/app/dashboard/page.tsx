
import {
  Card,
  
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



import { unstable_noStore as noStore } from "next/cache";



export default async function Dashboard() {
  noStore();
  
  return (
    <>
      

      <div className="grid gap-4 md:gp-8 lg:grid-cols-2 xl:grid-cols-3 mt-10">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Welcome to your dashboard.
            </CardDescription>
          </CardHeader>
          
        </Card>

        
      </div>
    </>
  );
}