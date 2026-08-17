import DownloadClient from './DownloadClient';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const metadata = {
  title: 'Download Technical Catalogues & Machinery Brochures | AFP Technologies',
  description:
    'Download official product brochures, layout specifications, and engineering data sheets for AFP Technologies industrial food processing equipment.',
};

async function getDownloads() {
  try {
    const res = await fetch(`${API_BASE_URL}/downloads`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error('Failed to load downloads:', err);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function DownloadPage() {
  const [downloads, categories] = await Promise.all([
    getDownloads(),
    getCategories(),
  ]);

  return <DownloadClient initialDownloads={downloads} categories={categories} />;
}