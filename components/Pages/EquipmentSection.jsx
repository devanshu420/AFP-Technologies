import Link from "next/link";
import { ArrowRight } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function getEquipmentRange() {
  try {
    const res = await fetch(`${API_URL}/equipment-range`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.error("Equipment section error:", error);
    return [];
  }
}

export default async function EquipmentSection() {
  const equipmentData = await getEquipmentRange();

  return (
    <section id="equipment" className="equipment section">
      <div className="container">
        {/* =====================================================
            SECTION HEADING
        ===================================================== */}

        <div className="section-heading">
          <div>
            <p className="kicker">
              <span /> THE AFP TECHNOLOGIES RANGE
            </p>

            <h2>
              One partner.
              <br />
              <em>Every food processing solution.</em>
            </h2>
          </div>

          <p className="section-note">
            From single washing & slicing units to complete automated
            potato chips, french fries, and snack lines, our engineered
            systems deliver maximum yield and reliability for industrial
            production floors.
          </p>
        </div>

        {/* =====================================================
            EQUIPMENT LIST
        ===================================================== */}

        <div className="equipment-list">
          {equipmentData.length > 0 ? (
            equipmentData.map((item, i) => {
              // API me slug available hai to slug use hoga.
              // Nahi to _id fallback hoga.
              const productId = item.slug || item._id;

              return (
                <Link
                  href={`/products/${productId}`}
                  className="equipment-row"
                  key={item._id || item.slug || item.name}
                >
                  {/* NUMBER */}

                  <span className="row-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* NAME */}

                  <strong>
                    {item.name || "Unnamed Equipment"}
                  </strong>

                  {/* DETAIL */}

                  <span className="row-detail">
                    {item.shortDescription ||
                      item.description ||
                      "Industrial food processing equipment"}
                  </span>

                  {/* ARROW */}

                  <ArrowRight size={18} />
                </Link>
              );
            })
          ) : (
            <div className="equipment-row">
              <strong>No equipment available</strong>

              <span className="row-detail">
                Equipment will appear here once available.
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            VIEW ALL
        ===================================================== */}

        {equipmentData.length > 0 && (
          <div className="mt-6">
            <Link
              href="/equipment-range"
              className="inline-flex items-center gap-2"
            >
              View Complete Equipment Range
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}