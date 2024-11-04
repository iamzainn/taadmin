import { getUmrahPackageSubscriptions } from '@/lib/dataFetching'

import { DataTableUmrahSubscription } from './DataTableUmrahSubscription'
import { unstable_noStore } from 'next/cache';
// import Pagination from '../TravelOrders/Pagination';

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function UmrahPackageSubscriptions({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  unstable_noStore();
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1
  const { subscriptions} = await getUmrahPackageSubscriptions(page)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Umrah Package Subscriptions</h2>
      <DataTableUmrahSubscription data={subscriptions} />
      {/* {totalPages > 1 && <Pagination totalPages={totalPages} />} */}
    </div>
  )
}