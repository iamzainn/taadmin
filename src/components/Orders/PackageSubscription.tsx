
import { getTravelPackageSubscriptions } from '@/lib/dataFetching'

import Pagination from './Pagination'
import { DataTablePackageSubscription } from './DataTablePackageSubscription'
import { unstable_noStore } from 'next/cache';


export default async function PackageSubscriptions({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1
  const { subscriptions, totalPages } = await getTravelPackageSubscriptions(page)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Travel Packages Customer Subscription</h2>
     
        <DataTablePackageSubscription data={subscriptions} />
        <Pagination totalPages={totalPages} />
     
    </div>
  )
}