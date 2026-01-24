import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { AboutTeam } from '@/components/home/about-team';
import { TeamSection } from '@/components/home/team-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TeamSection />
      {/* <Features /> */}
      <AboutTeam />
    </>
  );
}
