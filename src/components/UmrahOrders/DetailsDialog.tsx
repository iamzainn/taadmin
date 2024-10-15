'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { CustomUmrahPackages, UmrahPackageSubscription, UmrahPackage } from "@prisma/client";

type DetailsDialogProps = {
  item: (CustomUmrahPackages | (UmrahPackageSubscription & { UmrahPackage: UmrahPackage })) | null;
  onClose: () => void;
};

export default function DetailsDialog({ item, onClose }: DetailsDialogProps) {
  if (!item) return null;

  const isCustomPackage = 'CustomerName' in item;

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isCustomPackage ? 'Custom Umrah Order Details' : 'Umrah Package Subscription Details'}</DialogTitle>
          <DialogDescription>
            Complete information about the selected order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isCustomPackage ? (
            <>
              <DetailItem label="Customer Name" value={item.CustomerName} />
              <DetailItem label="Email" value={item.email} />
              <DetailItem label="Phone Number" value={item.phoneNumber} />
              <DetailItem label="Location" value={item.location} />
              <DetailItem label="Hotel Name" value={item.hotelName} />
              <DetailItem label="Check In" value={format(new Date(item.checkIn), 'PPP')} />
              <DetailItem label="Check Out" value={format(new Date(item.checkOut), 'PPP')} />
              <DetailItem label="Rooms" value={item.rooms.toString()} />
              <DetailItem label="Nights" value={item.nights.toString()} />
              <DetailItem label="Sector" value={item.Sector} />
              <DetailItem label="Vehicle Type" value={item.VehicleType} />
            </>
          ) : (
            <>
              <DetailItem label="First Name" value={item.firstName} />
              <DetailItem label="Last Name" value={item.lastName} />
              <DetailItem label="Email" value={item.email} />
              <DetailItem label="Phone Number" value={item.phoneNumber} />
              <DetailItem label="Country" value={item.country} />
              <DetailItem label="Package Name" value={item.UmrahPackage.title} />
              <DetailItem label="Created At" value={format(new Date(item.createdAt), 'PPP')} />
              <DetailItem label="Updated At" value={format(new Date(item.updatedAt), 'PPP')} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <span className="font-bold">{label}:</span>
      <span className="col-span-3">{value}</span>
    </div>
  );
}