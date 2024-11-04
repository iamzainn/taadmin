export interface DateRange {
    startDate: string;
    endDate: string;
  }
  
  export interface FilterParams {
    destination?: string;
    dateRange?: DateRange;
    page: number;
  }



  export interface TravelPackage {
    id: string;
    name: string;
    destination: string;
    // Add other fields as per your schema
  }
  
  export interface PackageSubscription {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    createdAt: string;
    TravelPackage: TravelPackage;
    // Add other fields as per your schema
  }