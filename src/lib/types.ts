export interface TravelOrder {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  Destination: string;
  createdAt: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  arrival: string;  // Changed from destination to arrival as per your code
}

export interface PackageSubscription {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  createdAt: string;
  travelDate: string;
  TravelPackage: TravelPackage;
}