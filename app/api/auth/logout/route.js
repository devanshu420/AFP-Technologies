import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/demo-store'
export async function POST(request) {
  const token = request.cookies.get('machina_demo_session')?.value
  deleteSession(token)
  const response = NextResponse.json({ data: { loggedOut: true } })
  response.cookies.set('machina_demo_session', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
