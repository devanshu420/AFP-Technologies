import { NextResponse } from 'next/server'
import { deleteProduct, getProduct, updateProduct } from '@/lib/demo-store'

export async function GET(_request, { params }) {
  const product = getProduct((await params).id)
  return product ? NextResponse.json({ data: product }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
export async function PATCH(request, { params }) {
  const product = updateProduct((await params).id, await request.json())
  return product ? NextResponse.json({ data: product }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
export async function DELETE(_request, { params }) {
  return deleteProduct((await params).id) ? NextResponse.json({ data: { deleted: true } }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
