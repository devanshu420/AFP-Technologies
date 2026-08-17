import { NextResponse } from 'next/server'
import { createEnquiry, listEnquiries } from '@/lib/demo-store'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json({ data: listEnquiries(searchParams.get('status') || '') })
}
export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body?.name || !body?.email || !body?.message) return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
  if (!/^\S+@\S+\.\S+$/.test(body.email)) return NextResponse.json({ error: 'Please provide a valid email' }, { status: 400 })
  return NextResponse.json({ data: createEnquiry(body) }, { status: 201 })
}
