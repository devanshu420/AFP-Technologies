import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import AboutSection from '../../components/Pages//AboutSection';
import TrustSection from '../../components/Pages/TrustSection';

export const metadata = {
  title: 'About Us | AFP Technologies Industries',
  description: 'Learn about our engineering expertise, vision, and machinery solutions.',
};

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <div style={{ paddingTop: '6rem' }}>
        <AboutSection />
        <TrustSection />
      </div>
      <Footer />
    </main>
  );
}