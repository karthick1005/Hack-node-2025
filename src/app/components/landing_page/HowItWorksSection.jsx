const HowItWorksSection = () => (
  <section
    id="howitworks"
     className="w-full min-h-screen scroll-mt-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 pt-8 md:pt-10 pb-8 px-4 md:px-20 rounded-2xl shadow-lg mx-auto mt-4"
  >
    <h2 className="text-4xl font-bold text-center mb-12 mt-4">
      How CardSmart Works
    </h2>
    <p className="text-center text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
      Our intelligent system learns from your habits to create a personalized
      experience.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 w-full items-stretch justify-items-center">
      {/* Step 1 */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center justify-start text-center h-full w-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold mb-4">
          1
        </div>
        <h3 className="font-semibold text-xl mb-2 text-indigo-600">
          Connect Your Cards
        </h3>
        <p className="text-gray-700">
          Import your existing cards from Apple Wallet, Google Pay, and other
          platforms.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center justify-start text-center h-full w-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold mb-4">
          2
        </div>
        <h3 className="font-semibold text-xl mb-2 text-indigo-600">
          Set Preferences
        </h3>
        <p className="text-gray-700 mb-2">
          Choose which data to share and customize your organization
          preferences.
        </p>
        <ul className="list-disc ml-4 text-gray-600 text-left">
          <li>Location-based sorting</li>
          <li>Time-based suggestions</li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center justify-start text-center h-full w-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold mb-4">
          3
        </div>
        <h3 className="font-semibold text-xl mb-2 text-indigo-600">
          AI Learns Your Habits
        </h3>
        <p className="text-gray-700">
          Our system observes which cards you use when and where to improve
          suggestions.
        </p>
      </div>

      {/* Step 4 */}
      <div className="bg-white/90 p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center justify-start text-center h-full w-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold mb-4">
          4
        </div>
        <h3 className="font-semibold text-xl mb-2 text-indigo-600">
          Enjoy Smart Organization
        </h3>
        <p className="text-gray-700">
          The right cards appear at the right time, making payments faster and
          more convenient.
        </p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
