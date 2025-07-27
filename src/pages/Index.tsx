import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Calendar from "@/components/Calendar";
import PricingPackages from "@/components/PricingPackages";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Calendar />
      <PricingPackages />
      <Footer />
    </div>
  );
};

export default Index;
