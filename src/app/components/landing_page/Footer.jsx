import React from "react";
import FooterColumn from "./FooterColumn";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Integrations", href: "#" },
  { label: "Updates", href: "#" },
];
const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];
const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "GDPR Compliance", href: "#" },
];

const Footer = () => (
  <footer className="bg-white text-gray-700 pt-14 pb-6 px-4 md:px-16 border-t border-sky-200 w-full">
    <div className="w-full flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
      {/* Left: Brand and tagline */}
      <div className="mb-10 md:mb-0 md:w-1/4">
        <div className="text-2xl font-extrabold text-sky-600 mb-2">
          CardSmart
        </div>
        <div className="text-gray-500 mb-4">
          The intelligent way to
          <br />
          organize your digital wallet.
        </div>
        <div className="flex gap-3 mt-2">
          {/* Social Icons */}
          {/* ... icons remain unchanged ... */}
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
        <FooterColumn title="Product" links={productLinks} />
        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>
    </div>

    <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500 text-sm">
      &copy; 2023 CardSmart. All rights reserved.
    </div>
  </footer>
);

export default Footer;
