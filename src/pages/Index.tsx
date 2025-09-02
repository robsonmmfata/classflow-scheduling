import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Calendar from "@/components/Calendar";
import PackageSelector from "@/components/PackageSelector";
import Footer from "@/components/Footer";
import LocationLanguageModal from "@/components/LocationLanguageModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Calendar />
      <PackageSelector />
      <Footer />
      <LocationLanguageModal />
    </div>
  );
};

export default Index;
