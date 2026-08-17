import Nav from '../components/Pages/Nav';
import Footer from '../components/Pages/Footer';
import HeroSection from '../components/Pages/HeroSection';
import AboutSection from '../components/Pages/AboutSection';
import ProductsSection from '../components/Pages/Products/ProductsSection';
import EquipmentSection from '../components/Pages/EquipmentSection';
import TrustSection from '../components/Pages/TrustSection';
import ContactSection from '../components/Pages/ContactSection';

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <EquipmentSection />
      <TrustSection />
      <ContactSection />
      <Footer />
    </main>
  );
}