import { useRouter } from "next/navigation";
import React from "react";

const HeroSection = () => {
  const router = useRouter();

  return (
  <section id="hero" className="w-full h-auto md:h-screen bg-white px-4 md:px-12 py-10 md:py-0 overflow-hidden flex flex-col md:flex-row items-center justify-center">
    
    {/* Left Content */}
    <div className="flex-1 max-w-xl text-center md:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
        Your Cards,<br />
        <span className="text-sky-600">Intelligently</span><br />
        <span className="text-sky-600">Organized</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-4 mb-6">
        CardSmart brings your digital wallet to life with context-aware card
        management that learns your habits and adapts to your needs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center md:justify-start">
        <button className="bg-sky-600 text-white px-6 py-2 rounded-full shadow hover:bg-sky-700 transition">
          Download App
        </button>
        <button className="border border-sky-600 text-sky-600 px-6 py-2 rounded-full hover:bg-sky-50 transition" onClick={() => window.open('https://www.youtube.com/watch?v=_owJDHAZWE4', '_blank')}>
          Watch Demo
        </button>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-3">
        <div className="flex -space-x-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
            alt="user1"
          />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
            alt="user2"
          />
          <img
            src="https://randomuser.me/api/portraits/men/65.jpg"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
            alt="user3"
          />
        </div>
        <div className="text-gray-800 text-sm sm:text-base font-medium">
          <span className="text-yellow-400 text-lg sm:text-xl">★★★★★</span>
          <span className="ml-2 font-bold">4.9/5</span>
          <span className="text-gray-500 ml-2 hidden sm:inline">from 2,000+ reviews</span>
        </div>
      </div>
    </div>

    {/* Right Image */}
    <div className="flex-1 flex items-center justify-center mt-10 md:mt-0">
      <div className="w-[300px] sm:w-[400px] md:w-[600px] lg:w-[750px] aspect-square translate-x-0 md:translate-x-6">
        <img
          onClick={() => router.push("/login")}
          src="/wallet.png"
          alt="Wallet UI"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  </section>
);
}
export default HeroSection;
