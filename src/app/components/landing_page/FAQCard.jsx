export default function FAQCard({ question, answer }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow flex flex-col items-center justify-center text-center h-full">
      <h3 className="font-semibold text-lg mb-2">{question}</h3>
      <p className="text-gray-700">{answer}</p>
    </div>
  );
}
