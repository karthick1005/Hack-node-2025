import FeatureCard from "./FeatureCard";

const FeaturesSection = () => (
  <section
    id="features"
    className="bg-white pt-28 pb-14 px-4 md:pt-32 md:pb-18 md:px-16 rounded-2xl shadow-lg w-full mx-auto mt-8"
  >
    <h2 className="text-4xl font-bold text-center mb-8">
      Smart Features for Everyday Use
    </h2>

    <p className="text-center text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
      Our wallet adapts to your lifestyle, bringing the right cards to the
      surface exactly when you need them.
    </p>

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 w-full">
      <FeatureCard
        icon="📍"
        title="Location Awareness"
        description="Transit cards appear at stations, loyalty cards at your favorite stores, and payment methods optimized for each merchant."
      />
      <FeatureCard
        icon="⏰"
        title="Time Intelligence"
        description="Morning commute cards, lunch payment options, or evening entertainment passes - all prioritized at the right time of day."
      />
      <FeatureCard
        icon="📊"
        title="Usage Analytics"
        description="Track spending patterns, reward points, and usage frequency to optimize your card selection and maximize benefits."
      />
      <FeatureCard
        icon="🔒"
        title="Advanced Security"
        description="Biometric authentication and encryption keep your cards safe while maintaining quick access when you need them."
      />
      <FeatureCard
        icon="⚙️"
        title="Customizable Preferences"
        description="Fine-tune the AI suggestions or manually set preferred cards for specific locations and scenarios."
      />
      <FeatureCard
        icon="💳"
        title="Wallet Integration"
        description="Seamlessly works with Apple Wallet, Google Wallet, and other popular digital payment platforms."
      />
    </div>
  </section>
);

export default FeaturesSection;
