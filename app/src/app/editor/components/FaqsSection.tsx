'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, FileEdit } from 'lucide-react';

const faqs = [
  { question: 'What is a 3D Mockup?', answer: 'A 3D Mockup is a digital representation of a product that helps you visualize how your design will look in a real-world setting.' },
  { question: 'Why should I use 3D Mockups for my designs?', answer: '3D Mockups help present your designs professionally and realistically without the need for physical prototypes.' },
  { question: 'How do I create a 3D Mockup with Mockey.ai?', answer: 'Go to 3D Mockups, choose a category, upload your images, customize the design, and download it.' },
  { question: 'Can I customize 3D Mockups to match my brand?', answer: 'Yes, you can change colors, add logos, and apply textures to match your brand identity.' },
  { question: 'Are 3D Mockups suitable for product presentations?', answer: 'Absolutely. They are great for showcasing products in pitches, online stores, and advertisements.' },
  { question: 'What file formats are available for downloading 3D Mockups?', answer: 'You can download mockups in PNG, JPEG, or as webm videos.' },
  { question: 'Is there a free version of 3D Mockups available?', answer: 'Yes, Mockey.ai offers a freemium version with basic features.' },
  { question: 'Can I use 3D Mockups for commercial purposes?', answer: 'Yes, the generated mockups can be used for both personal and commercial purposes.' },
  { question: 'How do I ensure high-quality rendering of my 3D Mockups?', answer: 'Upload high-resolution images and use premium templates when possible.' },
];

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState('faqs');

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r flex flex-col items-center py-4 space-y-6">
        <div
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={() => setSelectedSection('edit')}
        >
          <div className="bg-pink-100 p-2 rounded-md">
            <Pencil className="h-5 w-5 text-pink-500" />
          </div>
          <span className="text-xs font-medium text-gray-900">Edit</span>
        </div>

        <div
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={() => setSelectedSection('faqs')}
        >
          <div className="bg-pink-100 p-2 rounded-md">
            <FileEdit className="h-5 w-5 text-pink-500" />
          </div>
          <span className="text-xs font-medium text-gray-900 text-center">AI Mockup</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        {selectedSection === 'edit' ? (
          <div className="flex justify-center">
            <Image
              src="/images/Screenshot_2025-05-03_121503.png"
              alt="Edit Preview"
              width={300}
              height={800}
              className="rounded shadow"
            />
          </div>
        ) : (
          <section className="bg-white rounded-2xl p-6 md:p-10 shadow">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">FAQs on 3d Mockups</h2>
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    className="w-full flex justify-between items-center py-4 text-left text-gray-800 hover:text-purple-600 font-medium"
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span className="ml-2">{openIndex === index ? '▾' : '▸'}</span>
                  </button>
                  {openIndex === index && (
                    <div className="py-2 text-gray-600">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-10">
              <h3 className="text-xl font-bold text-gray-900">Mockey AI: Mockup Templates and AI Design Tools</h3>
              <p className="mt-2 text-gray-700 text-sm">
                Mockey AI is a freemium AI Mockup Generator with thousands of unique, high-quality, and cool mockup templates in 24+ categories. With Mockey AI, you can create apparel, accessories, home & living, and tech mockups instantly. It also offers AI mockup bundles, AI image background remover, AI Photography, Image Blur, and a host of design tools for your workflow automation.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
