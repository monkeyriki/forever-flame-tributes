import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import RecentMemorials from "@/components/RecentMemorials";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Per Sempre Ricordati – Memoriali Online</title>
        <meta
          name="description"
          content="Crea memoriali online per onorare e ricordare le persone care. Uno spazio rispettoso per preservare i ricordi."
        />
      </Helmet>

      <Layout>
        <HeroSection />
        <RecentMemorials />
        <FeaturesSection />
        <TestimonialsSection />
      </Layout>
    </>
  );
};

export default Index;
