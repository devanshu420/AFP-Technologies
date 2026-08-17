import { NextResponse } from 'next/server'
import { updateEnquiry } from '@/lib/demo-store'
export async function PATCH(request, { params }) {
  const enquiry = updateEnquiry((await params).id, await request.json())
  return enquiry ? NextResponse.json({ data: enquiry }) : NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
}
