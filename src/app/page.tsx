import HeroSection from '@/components/landing-page/HeroSection';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import TestimonialsSection from '@/components/landing-page/TestimonialsSection';
import PricingSection from '@/components/landing-page/PricingSection';
import FAQSection from '@/components/landing-page/FAQSection';
import CTASection from '@/components/landing-page/CTASection';
import Footer from '@/components/landing-page/Footer';
import VideoSection from '@/components/landing-page/VideoSelection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
