import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { AuthCallbackResponse } from '@/types/types'
import { db } from '@/db'
// import { z } from 'zod'
// import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
// import { absoluteUrl } from '@/lib/utils'
// import {
//   getUserSubscriptionPlan,
//   stripe,
// } from '@/lib/stripe'
// import { PLANS } from '@/config/stripe'

export const appRouter = router({ 
  authCallback: publicProcedure.query<AuthCallbackResponse>(async () => {
    const { getUser } = await getKindeServerSession()
    const user = await getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      })
    }

    return { success: true }
  }),

});
export type AppRouter = typeof appRouter;

