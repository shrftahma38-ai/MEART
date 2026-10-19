import { CallToAction } from '../components/home/CallToAction';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { Hero } from '../components/home/Hero';
import { Services } from '../components/home/Services';
import { Team } from '../components/home/Team';
import { WhoWeAre } from '../components/home/WhoWeAre';
import { WhyChoose } from '../components/home/WhyChoose';

export function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <FeaturedProperties />
      <Services />
      <WhyChoose />
      <Team />
      <CallToAction />
    </>
  );
}
