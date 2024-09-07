
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db';
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard';

const Page = async () => {
  console.log("in dashboard")
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user || !user.id) {
      console.log("going auth callback 1")
      redirect('/auth-callback?origin=dashboard');
    } 
  
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })
  
    if(!dbUser) {
      console.log("going auth callback 2")
      redirect('/auth-callback?origin=dashboard')
    }
  
    // const subscriptionPlan = await getUserSubscriptionPlan() 

    // return (
    //     <>
    //     <div>email: {user.email}</div>
    //     <div>firstname: {user.given_name}</div>
    //     <div>lastname: {user.family_name}</div>
    //     </>
    // );
    
    return (
      <div>
        <Dashboard 
        //  subscriptionPlan={subscriptionPlan}
        />
      </div>
    );
  }
  
  export default Page

