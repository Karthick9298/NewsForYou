import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
import { Contribute } from '@/components/contribute';
import { Footer } from '@/components/footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="pt-24">
          <HeroSection />
        </div>
        <HowItWorks />
        <Contribute />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
