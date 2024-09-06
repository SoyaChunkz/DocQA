"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'
import { AuthCallbackResponse, TRPCError } from '@/types/types'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  // Use the query and handle success and error in a more traditional way
  const { data, error } = trpc.authCallback.useQuery(undefined)

  if (data) {
    const { success } = data as AuthCallbackResponse;
    if (success) {
      router.push(origin ? `/${origin}` : '/dashboard');
    }
  }

  if (error) {
    const err = error as TRPCError;
    if (err.data?.code === 'UNAUTHORIZED') {
      router.push('/sign-in');
    }
  }

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page
