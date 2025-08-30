"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "./components/landing_page/Navbar";
import HeroSection from "./components/landing_page/HeroSection";
import FeaturesSection from "./components/landing_page/FeaturesSection";
import ContextSection from "./components/landing_page/ContextSection";
import HowItWorksSection from "./components/landing_page/HowItWorksSection";
import PrivacySection from "./components/landing_page/PrivacySection";
import FAQSection from "./components/landing_page/FAQSection";
import Footer from "./components/landing_page/Footer";

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = ["hero", "features", "howitworks", "privacy", "faq"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 80; // account for navbar height
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="font-sans text-gray-900 bg-gray-50">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        router={router}
      />
      <HeroSection />
      <FeaturesSection />
      <ContextSection />
      <HowItWorksSection />
      <PrivacySection />
      <FAQSection />
      <Footer />
    </main>
  );
}
