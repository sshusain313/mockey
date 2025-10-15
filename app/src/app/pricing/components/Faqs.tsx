export default function FAQPage() {
    const faqs = [
      {
        question: "Is there a free trial of Mockey Premium Plans?",
        answer:
          "Mockey is a free online mockup generator. Using Mockey you can generate great mock-ups for apparels, accessories, and a variety of products and download high-quality photos for any use case.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "We use Stripe payment gateway to accept payment for the subscription plans, which includes credit card, debit card, paypal, google pay, and apple pay as supported payment methods.",
      },
      {
        question: "Can I get a refund after payment?",
        answer:
          "For valid reasons, we can consider offering 100% refund for your subscription. It is usually not possible in case you’ve utilised our custom mockup and AI image generation services, in those cases we might offer partial refund when requested and applicable on a case-by-case basis.",
      },
      {
        question: "Can I cancel my subscription plan any time?",
        answer:
          "Yes, you can cancel your subscription plan any time. Once you cancel your subscription, you’ll not be charged again once the period for existing plan ends.",
      },
    ];
  
    return (
      <div className=" bg-white px-4 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQs</h1>
          <p className="text-gray-500 mb-10">
            Answers to some of your instant queries
          </p>
  
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-6">
              <div className="flex items-start gap-4">
                <span className="text-xl sm:text-2xl font-extrabold text-black leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-black text-base sm:text-lg mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
