import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const equipmentData = [
  { name: 'Injection moulding', detail: 'Precision at scale' },
  { name: 'CNC machining', detail: 'Accuracy redefined' },
  { name: 'Packaging & assembly', detail: 'Built for throughput' },
  { name: 'Material handling', detail: 'Move with confidence' },
];

export default function EquipmentSection() {
  return (
    <section id="equipment" className="equipment section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="kicker">
              <span /> THE AFP Technologies RANGE
            </p>
            <h2>
              One partner.
              <br />
              <em>Every possibility.</em>
            </h2>
          </div>
          <p className="section-note">
            From first concept to full-scale production, our equipment portfolio
            is designed to meet the real demands of modern manufacturing.
          </p>
        </div>

        <div className="equipment-list">
          {equipmentData.map((item, i) => (
            <Link href="/products" className="equipment-row" key={item.name}>
              <span className="row-number">0{i + 1}</span>
              <strong>{item.name}</strong>
              <span className="row-detail">{item.detail}</span>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}