import { NextResponse } from 'next/server'
import { hasSession } from '@/lib/demo-store'
export async function GET(request) {
  const authenticated = hasSession(request.cookies.get('machina_demo_session')?.value)
  return NextResponse.json({ data: { authenticated, role: authenticated ? 'admin' : null } })
}
