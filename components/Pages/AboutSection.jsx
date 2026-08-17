import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="intro section">
      <div className="container split">
        <div>
          <p className="kicker dark">
            <span /> WHO WE ARE
          </p>
          <h2>
            Not just machines.
            <br />
            <em>A better way forward.</em>
          </h2>
        </div>
        <div className="intro-copy">
          <p>
            AFP Technologies is a machinery partner for ambitious manufacturers. We
            bring together world-class equipment, practical expertise, and a
            service mindset that keeps your operation moving.
          </p>
          <Link className="text-link" href="/about">
            Meet our team <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}