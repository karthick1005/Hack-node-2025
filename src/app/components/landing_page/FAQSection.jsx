import FAQCard from "./FAQCard";

const FAQSection = () => (
  <section
    id="faq"
    className="bg-white min-h-screen flex flex-col justify-center items-center px-4 md:px-16 py-16"
  >
    <h2 className="text-4xl font-bold text-center mb-12">
      Frequently Asked Questions
    </h2>

    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <FAQCard
        question="How secure is CardSmart?"
        answer="CardSmart uses bank-level encryption and does not store your card details on public servers."
      />
      <FAQCard
        question="Can I use CardSmart for free?"
        answer="Yes, CardSmart offers a free plan with all essential features. Premium plans are available for advanced users."
      />
      <FAQCard
        question="How do I delete my account?"
        answer="You can delete your account from the dashboard settings at any time."
      />
    </div>
  </section>
);

export default FAQSection;
