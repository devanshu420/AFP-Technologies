import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import ContactSection from '../../components/Pages/ContactSection';

// Force dynamic rendering to prevent build-time prerender errors on Vercel
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us | AFP Technologies Industries',
  description: 'Get in touch with our team for machine quotes, specs, and support.',
};

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <div>
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}