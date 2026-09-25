import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import BeneficiosDestaque from "@/components/home/BeneficiosDestaque";
import CategoriasSection from "@/components/home/CategoriasSection";
import EmpresasSection from "@/components/home/EmpresasSection";
import ComoFunciona from "@/components/home/ComoFunciona";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BeneficiosDestaque />
        <CategoriasSection />
        <ComoFunciona />
        <EmpresasSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
