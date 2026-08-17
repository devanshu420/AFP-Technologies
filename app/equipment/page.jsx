import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import EquipmentSection from '../../components/Pages/EquipmentSection';

export const metadata = {
  title: 'Equipment Range | AFP Technologies',
  description: 'Explore our complete machinery range from CNC machining to food processing.',
};

export default function EquipmentPage() {
  return (
    <main>
      <Nav />
      <div>
        <EquipmentSection />
      </div>
      <Footer />
    </main>
  );
}