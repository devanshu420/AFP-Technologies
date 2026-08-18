import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const equipmentData = [
  {
    name: 'Automatic Potato Chips Processing Line',
    detail: 'Washing, peeling, precision slicing & continuous dewatering',
  },
  {
    name: 'French Fries Production & Cutting Line',
    detail: 'High-speed industrial cutting, blanching & freezing prep',
  },
  {
    name: 'Continuous Snack Frying & Seasoning Systems',
    detail: 'Automated temperature control & uniform flavour coating',
  },
  {
    name: 'Noodle & Pasta Production Lines',
    detail: 'Automated dough mixing, extruding, steaming & cutting',
  },
  {
    name: 'Momo, Dumpling & Spring Roll Automation',
    detail: 'Precision multi-shape forming, filling & wrapper handling',
  },
];

export default function EquipmentSection() {
  return (
    <section id="equipment" className="equipment section">
      <div className="container">
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
            From single washing & slicing units to complete automated potato chips,
            french fries, and snack lines, our engineered systems deliver maximum
            yield and reliability for industrial production floors.
          </p>
        </div>

        <div className="equipment-list">
          {equipmentData.map((item, i) => (
            <Link
              href="/products"
              className="equipment-row"
              key={item.name}
            >
              <span className="row-number">
                {String(i + 1).padStart(2, '0')}
              </span>
              <strong>{item.name}</strong>
              <span className="row-detail">{item.detail}</span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}