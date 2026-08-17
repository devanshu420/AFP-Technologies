import { NextResponse } from 'next/server'
import { createProduct, listProducts } from '@/lib/demo-store'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  return NextResponse.json({ data: listProducts({ q: searchParams.get('q') || '', category: searchParams.get('category') || '', status: searchParams.get('status') ?? 'active' }) })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body?.name || !body?.type || !body?.desc) return NextResponse.json({ error: 'name, type, and desc are required' }, { status: 400 })
  return NextResponse.json({ data: createProduct(body) }, { status: 201 })
}
