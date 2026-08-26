import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import Nav from "../../../components/Pages/Nav";
import Footer from "../../../components/Pages/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fetch single product from MongoDB via backend
async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error(`Error fetching product [${id}]:`, error);
    return null;
  }
}

// Fetch all active products for dynamic left sidebar
async function fetchAllActiveProducts() {
  try {
    const res = await fetch(`${API_URL}/products?active=true&limit=150`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.products || (Array.isArray(json?.data) ? json.data : []);
  } catch (error) {
    console.error("Error fetching catalogue for sidebar:", error);
    return [];
  }
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) return { title: "Product Not Found | AFP Technologies" };

  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Machinery Not Found | Industrial Solutions",
      description: "The requested industrial machine could not be found.",
    };
  }

  const title =
    product.seo?.title ||
    `${product.name} | Industrial Machinery & Turnkey Plants`;
  const description =
    product.seo?.description ||
    product.shortDescription ||
    (typeof product.description === "string"
      ? product.description.slice(0, 160)
      : "") ||
    "High-efficiency food processing line engineered for maximum operational throughput.";
  const keywords =
    product.seo?.keywords && product.seo.keywords.length > 0
      ? product.seo.keywords
      : [
          product.name,
          "food processing",
          "industrial machinery",
          "turnkey line",
        ];

  const mainImage =
    product.images?.[0]?.url ||
    product.mainImage?.url ||
    product.image ||
    "/placeholder-machinery.jpg";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        { url: mainImage, alt: product.images?.[0]?.alt || product.name },
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const [product, allProducts] = await Promise.all([
    fetchProduct(id),
    fetchAllActiveProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Nav />
      <ProductDetailClient
        currentId={id}
        initialProduct={product}
        allProducts={allProducts}
      />
      <Footer />
    </>
  );
}
