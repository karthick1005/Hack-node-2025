import React, { useState, useEffect } from "react";

const navItems = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How it works", id: "howitworks" },
  { label: "Privacy", id: "privacy" },
  { label: "FAQ", id: "faq" },
];

const Navbar = ({ activeSection, setActiveSection, router }) => {
  const [showDesktopNav, setShowDesktopNav] = useState(false);
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    const handleIntersect = (entries) => {
      if (isManuallyScrolling) return;

      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        const sorted = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveSection(sorted[0].target.id);
      }
    };

    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-50px 0px -60% 0px",
      threshold: 0.3,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection, isManuallyScrolling]);

  const handleNavClick = (id) => {
    setIsManuallyScrolling(true);
    setActiveSection(id);

    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 50; // Reduced offset for mobile
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setTimeout(() => setIsManuallyScrolling(false), 1000);
  };

  return (
    <nav className="fixed w-full z-50 flex justify-between items-center p-1 md:p-3 bg-white/70 shadow-xl backdrop-blur-lg min-h-[40px] md:min-h-[60px] rounded-b-2xl border-b border-slate-200">
      <div className="text-xl my-1 md:text-2xl ml-8 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 drop-shadow px-1 select-none">
        CardSmart
      </div>

      <div className="flex gap-2 items-center mr-8">
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`px-4 py-2 rounded-xl focus:outline-none transition-all duration-200 border-b-2 shadow-sm font-semibold tracking-wide relative overflow-hidden group cursor-pointer ${
                activeSection === item.id
                  ? "text-sky-600 border-sky-600 bg-gradient-to-r from-sky-50/80 to-purple-50/80"
                  : "text-gray-700 border-transparent hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-pink-50/80"
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="z-10 relative">{item.label}</span>
              <span
                className={`absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
                  activeSection === item.id ? "scale-x-100" : ""
                }`}
              ></span>
            </button>
          ))}
          <button
            className="px-2 py-2 border border-indigo-600 text-indigo-600 rounded-xl bg-white hover:bg-gradient-to-r cursor-pointer hover:from-indigo-100 hover:to-pink-100 transition font-bold shadow-sm"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="px-1.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg flex items-center gap-1 shadow-lg hover:scale-105 transition-transform duration-200"
            onClick={() => setShowDesktopNav((prev) => !prev)}
          >
            <span className="text-sm">&#9776;</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Content */}
      {showDesktopNav && (
        <div className="flex flex-col items-start gap-2 bg-white/95 p-4 rounded-2xl shadow-2xl absolute top-10 right-2 z-50 w-48 border border-slate-200 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left px-4 py-2 rounded-xl focus:outline-none transition-all duration-200 border-l-4 font-semibold tracking-wide ${
                activeSection === item.id
                  ? "text-sky-600 border-sky-600 font-bold bg-gradient-to-r from-sky-50/80 to-purple-50/80"
                  : "text-gray-700 border-transparent hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-pink-50/80"
              }`}
              onClick={() => {
                handleNavClick(item.id);
                setShowDesktopNav(false);
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => router.push("/login")}
            className="w-full text-left text-indigo-600 border border-indigo-600 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100 transition mt-2 font-bold shadow-sm"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Fullscreen Mobile Nav (Optional) */}
      {showDesktopNav && (
        <div
          id="mobile-nav"
          className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-start pt-16 px-4 space-y-4 text-xl overflow-y-auto"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full text-left text-gray-700 hover:text-indigo-600 bg-transparent px-2 py-3 rounded focus:outline-none"
              onClick={() => {
                handleNavClick(item.id);
                setShowDesktopNav(false);
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              router.push("/login");
              setShowDesktopNav(false);
            }}
            className="text-white bg-gradient-to-r from-indigo-600 to-purple-500 px-6 py-3 rounded-lg shadow hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-transform duration-200 focus:ring-2 focus:ring-purple-400"
          >
            Login with Google
          </button>
          <button
            aria-label="Close navigation menu"
            className="absolute top-6 right-8 text-3xl text-gray-700"
            onClick={() => setShowDesktopNav(false)}
          >
            &times;
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;