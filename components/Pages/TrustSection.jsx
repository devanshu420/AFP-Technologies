import { ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    num: '01',
    title: 'Engineering expertise',
    text: 'Real-world knowledge, not just product specs.',
  },
  {
    num: '02',
    title: 'Responsive service',
    text: 'Support that is there when your operation needs it.',
  },
  {
    num: '03',
    title: 'Long-term value',
    text: 'Reliable systems that earn their place on your floor.',
  },
];

export default function TrustSection() {
  return (
    <section className="trust section">
      <div className="container trust-inner">
        <div>
          <p className="kicker dark">
            <span /> THE AFP Technologies DIFFERENCE
          </p>
          <h2>
            Equipment is only
            <br />
            <em>the beginning.</em>
          </h2>
        </div>

        <div className="trust-grid">
          {trustItems.map((item) => (
            <div className="trust-item" key={item.num}>
              <span>{item.num}</span>
              <ShieldCheck size={20} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}