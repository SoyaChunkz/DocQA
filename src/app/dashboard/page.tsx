import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db';
import { redirect } from 'next/navigation'

const Page = async () => {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();
  
    if (!user || !user.id) redirect('/auth-callback?origin=dashboard');
  
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })
  
    if(!dbUser) redirect('/auth-callback?origin=dashboard')
  
    // const subscriptionPlan = await getUserSubscriptionPlan() 

    // return (
    //     <>
    //     <div>email: {user.email}</div>
    //     <div>firstname: {user.given_name}</div>
    //     <div>lastname: {user.family_name}</div>
    //     </>
    // );
    
    return
  }
  
  export default Page

