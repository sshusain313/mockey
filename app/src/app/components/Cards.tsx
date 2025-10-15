'use client'

import React from "react";
import {
  PiShoppingCartSimpleFill,
  PiPenNibFill,
  PiImagesFill,
  PiMegaphoneFill,
} from "react-icons/pi";

const cards = [
  {
    title: "E-commerce",
    description:
      "Generate high-quality professional looking product mockups for your e-commerce store or D2C brand.",
    icon: <PiShoppingCartSimpleFill className="text-3xl text-[#FF4C61]" />,
    gradient: "from-[#FFD1D1] to-[#FF8D8D]",
    accent: "#FF4C61",
  },
  {
    title: "Social Media",
    description:
      "Improve your content game with premium and free mockups. Get original biggest source of photo-realistic free PSD Mockups online.",
    icon: <PiMegaphoneFill className="text-3xl text-[#A855F7]" />,
    gradient: "from-[#E4D4FF] to-[#BFA4FF]",
    accent: "#A855F7",
  },
  {
    title: "Designers & Creators",
    description:
      "Mock-up templates are ideal to showcase your design directly on the appropriate products. Drag & adjust your designs to generate stunning results.",
    icon: <PiPenNibFill className="text-3xl text-[#FACC15]" />,
    gradient: "from-[#FFF6D1] to-[#FFE699]",
    accent: "#FACC15",
  },
  {
    title: "Print-on-Demand",
    description:
      "With free AI mockup generator, create stunning product photos easily and online for your print-on-demand business.",
    icon: <PiImagesFill className="text-3xl text-[#34D399]" />,
    gradient: "from-[#D1FFF6] to-[#99FFE6]",
    accent: "#34D399",
  },
];

export default function MockeyCards() {
  return (
    <section className="py-16 flex justify-center items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-6">
        {cards.map((card, index) => (
          <div key={index} className="flex justify-center">
            <Card {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Card Component
interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  accent: string;
}

function Card({ title, description, icon, gradient, accent }: CardProps) {
  return (
    <div
      className={`relative p-6 rounded-[16px] bg-gradient-to-br ${gradient} text-black h-[350px] w-full max-w-[350px] flex flex-col justify-between overflow-hidden shadow-lg transform transition-transform hover:scale-105`}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute right-0 w-5 h-1/4"
          style={{
            top: `${i * 25}%`,
            backgroundColor: accent,
            borderBottomLeftRadius: "9999px",
          }}
        />
      ))}

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
          Mockey for
          <span
            className="w-6 h-1 inline-block rounded-full"
            style={{ backgroundColor: accent }}
          />
        </p>
        <h3 className="font-['Bricolage_Grotesque'] text-[60px] leading-[60px] font-bold text-[#000000] tracking-normal mb-2">{title}</h3>
        <p className="text-sm text-black/80">{description}</p>
      </div>

    //   <div className="relative z-10 mt-6">
    //     <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-md">
    //       {icon}
    //     </div>
    //   </div>
    // </div>
  );
}
