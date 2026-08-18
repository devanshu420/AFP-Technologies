import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import ProductsSection from '../../components/Pages/Products/ProductsSection';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'Products Catalogue | AFP Technologies ',
  description: 'Browse our extensive line of high-performance industrial machines.',
};

export default function ProductsPage() {
  return (
    <main>
      <Nav />
      <div>
        <ProductsSection isStandalone={true} />
      </div>
      <Footer />
    </main>
  );
}