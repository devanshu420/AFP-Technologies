import Nav from '../../components/Pages/Nav';
import Footer from '../../components/Pages/Footer';
import DownloadSection from '../../components/Pages/DownloadSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Document Portal | AFP Technologies',
  description: 'Download technical brochures, blueprints, performance ratings, and engineering manuals.',
};

export default function DownloadPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-100/70">
      <Nav />
      <div className="flex-grow">
        <DownloadSection />
      </div>
      <Footer />
    </main>
  );
}