'use client'

import { useState } from "react";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronDown } from "@/components/icons/chevron-down";

const faqs = [
  {
    question: "What is T shirt Mockup?",
    answer: "A T-shirt mockup is a digital template that helps you visualize your design on a T-shirt without printing it.",
  },
  {
    question: "Why create a t-shirt mockup?",
    answer: "It allows you to showcase your design realistically for marketing or presentation purposes without actual production.",
  },
  {
    question: "Why Use Mockey’s T-Shirt Mockup?",
    answer: "Mockey offers easy-to-use, high-quality mockup tools powered by AI, perfect for creators, brands, and sellers.",
  },
  {
    question: "Is this T-Shirt Mockup Free?",
    answer: "Yes! Mockey provides free access to a wide range of mockup templates, including T-shirts.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl ml-10 mr-20 bg-[#f9fbfd] p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">FAQs on T-Shirt Mockups</h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left flex items-center justify-between text-gray-800 font-medium focus:outline-none"
            >
              {faq.question}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
