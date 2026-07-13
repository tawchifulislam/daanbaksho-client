import HeroSlider from '@/components/home/HeroSlider';
import TopFundedCampaigns from '@/components/home/TopFundedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import ExploreByCategory from '@/components/home/ExploreByCategory';
import Testimonials from '@/components/home/Testimonials';
import PlatformImpact from '@/components/home/PlatformImpact';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <TopFundedCampaigns />
      <HowItWorks />
      <ExploreByCategory />
      <Testimonials />
      <PlatformImpact />
      <Footer />
    </div>
  );
}
