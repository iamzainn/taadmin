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
    arrival: string;
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

  export interface TravelOrder {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    country: string;
    Destination: string;
    createdAt: string;
    
  }
  