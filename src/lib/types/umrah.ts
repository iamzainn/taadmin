export interface CustomUmrahOrder {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    familyMembers: number;
    travelDate: Date;
    durationInDays: number;
    transportNeeded: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type PackagePriceType = 'Sharing' | 'Quad' | 'Triple' | 'Double';

export interface UmrahPackageSubscription {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  packageId: string;
  packagePriceType: PackagePriceType;
  familyMembers: number;
  travelDate: Date;
  transportNeeded: boolean;
  createdAt: Date;
  updatedAt: Date;
  UmrahPackage: {
    id: string;
    title: string;
  };
}