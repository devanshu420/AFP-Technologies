const seedProducts = [
  { id: 'atlas-420', name: 'Atlas 420', type: 'Injection Moulding', category: 'Injection moulding', tag: 'Featured', status: 'active', desc: 'High-speed precision moulding for demanding production floors.', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=85&fm=jpg', specs: { force: '420 ton', cycle: '8.4 sec', control: 'Atlas OS' } },
  { id: 'forgeline-800', name: 'ForgeLine 800', type: 'CNC Machining', category: 'CNC machining', tag: 'Popular', status: 'active', desc: 'Heavy-duty machining with repeatable accuracy and smart monitoring.', image: 'https://images.unsplash.com/photo-1565439375870-7e8ad8d4aeb3?auto=format&fit=crop&w=1000&q=85&fm=jpg', specs: { spindle: '18,000 rpm', travel: '800 mm', control: 'ForgeOS' } },
  { id: 'novapack-x2', name: 'NovaPack X2', type: 'Packaging', category: 'Packaging', tag: 'New', status: 'active', desc: 'Flexible automated packaging for faster, cleaner throughput.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85&fm=jpg', specs: { speed: '120 ppm', format: 'Multi-format', control: 'Nova Flow' } },
]

const seedEnquiries = [
  { id: 'enq-1001', name: 'Priya Menon', company: 'Vertex Plastics', email: 'priya@example.com', phone: '+91 98765 43210', product: 'Atlas 420', message: 'Please share lead time and installation options.', status: 'new', createdAt: new Date().toISOString() },
  { id: 'enq-1002', name: 'Arun Das', company: 'Northstar Fabrication', email: 'arun@example.com', phone: '+91 99887 77665', product: 'ForgeLine 800', message: 'We need a quote for a two-machine cell.', status: 'contacted', createdAt: new Date(Date.now() - 86400000).toISOString() },
]

const state = globalThis.__machinaDemoState || { products: seedProducts, enquiries: seedEnquiries, sessions: new Map() }
globalThis.__machinaDemoState = state

export function listProducts({ q = '', category = '', status = 'active' } = {}) {
  const search = q.trim().toLowerCase()
  return state.products.filter((product) => (!status || product.status === status) && (!category || product.category.toLowerCase() === category.toLowerCase()) && (!search || `${product.name} ${product.type} ${product.desc}`.toLowerCase().includes(search)))
}
export function getProduct(id) { return state.products.find((product) => product.id === id) || null }
export function createProduct(input) { const product = { id: input.id || `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, status: 'active', tag: 'New', ...input }; state.products.unshift(product); return product }
export function updateProduct(id, input) { const index = state.products.findIndex((product) => product.id === id); if (index < 0) return null; state.products[index] = { ...state.products[index], ...input, id }; return state.products[index] }
export function deleteProduct(id) { const index = state.products.findIndex((product) => product.id === id); if (index < 0) return false; state.products.splice(index, 1); return true }
export function listEnquiries(status = '') { return state.enquiries.filter((item) => !status || item.status === status).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) }
export function createEnquiry(input) { const enquiry = { id: `enq-${Date.now()}`, status: 'new', createdAt: new Date().toISOString(), ...input }; state.enquiries.unshift(enquiry); return enquiry }
export function updateEnquiry(id, input) { const enquiry = state.enquiries.find((item) => item.id === id); if (!enquiry) return null; Object.assign(enquiry, input); return enquiry }
export function getStats() { return { products: state.products.length, activeProducts: state.products.filter((p) => p.status === 'active').length, enquiries: state.enquiries.length, newEnquiries: state.enquiries.filter((e) => e.status === 'new').length } }
export function createSession() { const token = `demo_${crypto.randomUUID()}`; state.sessions.set(token, { role: 'admin', createdAt: Date.now() }); return token }
export function hasSession(token) { return Boolean(token && state.sessions.has(token)) }
export function deleteSession(token) { if (token) state.sessions.delete(token) }
export function resetDemoStore() { state.products = structuredClone(seedProducts); state.enquiries = structuredClone(seedEnquiries); state.sessions.clear() }
