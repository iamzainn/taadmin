
import { getCustomTravelOrders } from '@/lib/dataFetching'

import Pagination from './Pagination'
import { DataTableCustomTravel } from './DataTableCustomTravel'
import { unstable_noStore } from 'next/cache'


export default async function CustomTravelOrders({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_noStore();
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
  const { orders, totalPages } = await getCustomTravelOrders(page)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Custom Travel Orders</h2>
      
        <DataTableCustomTravel data={orders} />
        <Pagination totalPages={totalPages} />
    
    </div>
  )
}