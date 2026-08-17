import { NextResponse } from 'next/server'
import { createSession } from '@/lib/demo-store'

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (body?.email !== 'admin@machina.demo' || body?.password !== 'machina-demo') return NextResponse.json({ error: 'Invalid demo credentials' }, { status: 401 })
  const response = NextResponse.json({ data: { role: 'admin', email: body.email } })
  response.cookies.set('machina_demo_session', createSession(), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
