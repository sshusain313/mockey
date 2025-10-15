'use client';

import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export default function FAQSection() {
  return (
    <>
      {/* CTA Video Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between rounded-3xl bg-gray-100 overflow-hidden">
          <div className="p-8 md:w-1/2 flex flex-col items-center justify-center ">
            <h3 className="font-['Bricolage_Grotesque'] text-[60px] leading-[60px] font-bold text-[#000000] tracking-normal mb-4 gap-2">Give it a try!</h3>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 10a1 1 0 011-1h3V4a1 1 0 112 0v5h3a1 1 0 110 2h-3v5a1 1 0 11-2 0v-5H4a1 1 0 01-1-1z" />
              </svg>
              Upload Design
            </button>
          </div>
          <div className="md:w-1/2 w-full">
            <video
              src="/mockey-cta-1.mp4"
              className="w-full h-auto"
              autoPlay
              muted
              loop
              playsInline
            ></video>
          </div>
        </div>
      </section>
    </>
  );
}
