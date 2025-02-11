import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import p_config from '@/payload.config'
import { getPayload } from 'payload'

export async function middleware(request: NextRequest) {
  const headers = request.headers
  const payloadConfig = await p_config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const response = NextResponse.next()

  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
