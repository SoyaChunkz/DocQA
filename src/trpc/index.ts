import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { AuthCallbackResponse } from '@/types/types'
import { db } from '@/db'
import { z } from 'zod'
import { UploadStatus } from '@prisma/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { error } from 'console'
// import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
// import { absoluteUrl } from '@/lib/utils'
// import {
//   getUserSubscriptionPlan,
//   stripe,
// } from '@/lib/stripe'
// import { PLANS } from '@/config/stripe'

const UploadStatusSchema = z.object({
  status: z.nativeEnum(UploadStatus), // Use the enum directly
});

export const appRouter = router({ 
  authCallback: publicProcedure
  .query<AuthCallbackResponse>(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser();

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

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

  getUserFiles: privateProcedure
  .query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    })
  }),

  getFileMessages: privateProcedure 
  .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      fileId: z.string()
  })).query(async ({ctx, input}) => {
    const {userId} = ctx;
    const {fileId, cursor} = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      }
    })

    if (!file) throw new TRPCError({code: "NOT_FOUND"})

    const messages = await db.message.findMany({
      take: limit + 1,
      where: {
        fileId,
      },
      orderBy: {
        createdAt: "desc"
      },
      cursor: cursor ? {id: cursor} : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      }
    })

    let nextCursor: typeof cursor | undefined = undefined;
    if( messages.length > limit ){
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return{
      messages,
      nextCursor,
    }
  }),

  getFileUploadStatus: privateProcedure
  .input(z.object({ fileId: z.string() }))
  .query(async ({ input, ctx }) => {
    const file = await db.file.findFirst({
      where: {
        id: input.fileId,
        userId: ctx.userId,
      },
    });

    // If the file is not found, return PENDING status
    if (!file) {
      return { status: 'PENDING' as const }; 
    }

    // Return the upload status from the database
    return { status: file.uploadStatus }; 
  }),

  getFile: privateProcedure
  .input(z.object({ key: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId,
      },
    })

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    return file
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      await db.file.delete({
        where: {
          id: input.id,
        },
      })

      return file
    }),
});
export type AppRouter = typeof appRouter;

