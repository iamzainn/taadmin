import { getCustomUmrahOrders } from '@/lib/dataFetching'

// import { DataTableCustomUmrah } from './DataTableCustomUmrah'
import { unstable_noStore } from 'next/cache'
import { DataTableCustomUmrah } from './DataTableCustomUmrah';

// import Pagination from '../TravelOrders/Pagination'

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function CustomUmrahOrders({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  unstable_noStore();
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
  const  data = await getCustomUmrahOrders(page)
 
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Custom Umrah Orders</h2>
     {data?.orders ? <DataTableCustomUmrah data={data.orders} /> : <p>No orders found</p>}
     
    </div>
  )
}