"use client";
import React, { useState } from "react";

const initialSettings = [
  {
    title: "Location Services",
    desc: "Allow CardSmart to access your location when using the app",
    active: true,
  },
  {
    title: "Usage Analytics",
    desc: "Track which cards you use to improve suggestions",
    active: true,
  },
  {
    title: "Background Processing",
    desc: "Allow CardSmart to update in the background",
    active: false,
  },
  {
    title: "Cloud Backup",
    desc: "Securely back up your card data to the cloud",
    active: true,
  },
  {
    title: "Anonymous Usage Data",
    desc: "Share anonymous data to improve the app",
    active: false,
  },
];

const PrivacySection = () => {
  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (index) => {
    const newSettings = [...settings];
    newSettings[index].active = !newSettings[index].active;
    setSettings(newSettings);
  };

  return (
    <section
      id="privacy"
      className="bg-white py-6 px-4 md:py-12 md:px-16 min-h-screen flex items-center justify-center"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-7xl">
        {/* Left side */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Your Privacy is Our Priority
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl">
            We believe in complete transparency about how your data is used to
            power CardSmart's intelligent features.
          </p>
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <span className="text-sky-600 text-3xl mt-1">🛡️</span>
              <div>
                <span className="font-semibold text-lg text-gray-900">
                  Local Processing
                </span>
                <p className="text-gray-700 text-base">
                  Most data processing happens directly on your device, not in
                  the cloud.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sky-600 text-3xl mt-1">👤</span>
              <div>
                <span className="font-semibold text-lg text-gray-900">
                  Granular Permissions
                </span>
                <p className="text-gray-700 text-base">
                  Choose exactly what data you share and when location tracking
                  is active.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sky-600 text-3xl mt-1">🗄️</span>
              <div>
                <span className="font-semibold text-lg text-gray-900">
                  Data Ownership
                </span>
                <p className="text-gray-700 text-base">
                  Your data belongs to you. Export or delete it anytime with one
                  tap.
                </p>
              </div>
            </div>
          </div>
          <button className="mt-2 px-8 py-3 border-2 border-sky-600 text-sky-600 rounded-full text-lg font-semibold bg-white hover:bg-sky-50 transition-all">
            Learn More About Privacy
          </button>
        </div>

        {/* Right side - Privacy Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              Privacy Settings
            </h3>
            <div className="flex flex-col gap-5">
              {settings.map(({ title, desc, active }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{title}</div>
                    <div className="text-gray-500 text-sm">{desc}</div>
                  </div>
                  <button
                    onClick={() => toggleSetting(index)}
                    className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-200 ${
                      active ? "bg-sky-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-6 w-6 bg-white border-2 rounded-full shadow transform transition-transform duration-200 ${
                        active ? "translate-x-full" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
