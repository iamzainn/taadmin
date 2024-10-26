import { getVisaOrders } from '@/lib/dataFetching';

import { unstable_noStore } from 'next/cache';
import { DataTableVisaOrders } from './DataTableVisaOrders';
import Pagination from '../TravelOrders/Pagination';

export default async function VisaOrdersTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { orders, totalPages } = await getVisaOrders(page);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visa Applications</h2>
      <DataTableVisaOrders data={orders} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}