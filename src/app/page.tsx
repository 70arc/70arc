import { Approach } from "@/components/approach";
import { ClosingCta } from "@/components/closing-cta";
import { HomeHero } from "@/components/home-hero";
import { MissionStatement } from "@/components/mission-statement";
import { Principles } from "@/components/principles";
import { ProductStory } from "@/components/product-story";
import { ValuesSection } from "@/components/values-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <MissionStatement />
      <ProductStory />
      <Principles />
      <Approach />
      <ValuesSection />
      <ClosingCta />
    </>
  );
}
