import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from 'next/server'

// handleAuth() validates the Kinde env vars when invoked, so build it
// per-request instead of at module scope to keep `next build` env-free.
export const GET = (
  request: NextRequest,
  context: { params: { kindeAuth: string } }
) => handleAuth()(request, context)
