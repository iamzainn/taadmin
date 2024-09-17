'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';

type DetailsDialogProps = {
  item: {
      TravelPackage: { name: string}; id: string; firstName: string; lastName: string; email: string; createdAt: string; updatedAt: string; phoneNumber: string; country: string; city: string; address: string; postalCode: string; 
} | null;
  onClose: () => void;
};

export default function DetailsDialog({ item, onClose }: DetailsDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information about the selected order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{item.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">First Name:</span>
            <span className="col-span-3">{item.firstName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Last Name:</span>
            <span className="col-span-3">{item.lastName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Email:</span>
            <span className="col-span-3">{item.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Phone:</span>
            <span className="col-span-3">{item.phoneNumber}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Country:</span>
            <span className="col-span-3">{item.country}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Created At:</span>
            <span className="col-span-3">{format(new Date(item.createdAt), 'PPP')}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Updated At:</span>
            <span className="col-span-3">{format(new Date(item.updatedAt), 'PPP')}</span>
          </div>
          {item.TravelPackage && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Package:</span>
              <span className="col-span-3">{item.TravelPackage.name}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}