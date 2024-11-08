export interface VisaOrder {
    id: string;
    fullName: string;
    email: string;
    nationality: string;
    travelDate: Date;
    numberOfVisas: number;
    processingType: 'Normal' | 'Urgent';
    countryName: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: string;
  }
  
  export const ProcessingTypes = {
    NORMAL: 'Normal',
    URGENT: 'Urgent'
  } as const;
  
  export type ProcessingType = typeof ProcessingTypes[keyof typeof ProcessingTypes];