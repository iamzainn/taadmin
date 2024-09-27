
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
export default function Home() {


   //check clerk auth

   const { userId } = auth()
   if(userId){
    redirect("/dashboard")
   }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Admin side of bahaar journeys Admin must have to sign in.
    </div>
  );
}
