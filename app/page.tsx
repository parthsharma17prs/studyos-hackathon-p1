
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import FeatureCards from '@/components/landing/FeatureCards';
import Reviews from '@/components/landing/Reviews';
import HowItWorks from '@/components/landing/HowItWorks';
import Stats from '@/components/landing/Stats';
import Footer from '@/components/landing/Footer';

/**
 * StudyOS Landing Page
 * Luxury Minimalist Redesign
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <Navbar />

      {/* Hero — Giant animated headline + CTAs */}
      <Hero />

      {/* Sliding stats */}
      <Stats />

      <div className="ribbon-landing" />

      {/* 6 Feature cards with 3D tilt */}
      <FeatureCards />

      <div className="ribbon-landing" />

      {/* Testimonials */}
      <Reviews />

      <div className="ribbon-landing" />

      {/* How it works — 3 steps */}
      <HowItWorks />

      <div className="ribbon-landing" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
