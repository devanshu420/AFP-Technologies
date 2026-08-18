import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import AboutSection from '../../components/Pages//AboutSection';
import TrustSection from '../../components/Pages/TrustSection';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'About Us | AFP Technologies Industries',
  description: 'Learn about our engineering expertise, vision, and machinery solutions.',
};

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <div >
        <AboutSection />
        <TrustSection />
      </div>
      <Footer />
    </main>
  );
}