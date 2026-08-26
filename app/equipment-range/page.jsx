import EquipmentRangeClient from "./EquipmentRangeClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function getEquipmentRange() {
  try {
    const res = await fetch(
      `${API_URL}/equipment-range`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json?.data)
      ? json.data
      : [];
  } catch (error) {
    console.error(
      "Equipment range page error:",
      error
    );

    return [];
  }
}

export default async function EquipmentRangePage() {
  const products = await getEquipmentRange();

  return (
    <EquipmentRangeClient
      products={products}
    />
  );
}