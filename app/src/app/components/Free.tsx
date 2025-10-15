// import Image from 'next/image';

// const mockups = [
//   {
//     title: 'Hoodie Mockups',
//     description:
//       '100+ Hoodie mockups with stunning photos of models, men & women, and more. for t-shirt mockups.',
//     image: '/Hoodie-Mockup.webp',
//   },
//   {
//     title: 'Tanktop Mockups',
//     description:
//       'Download stylish 100+ Tank top mockups for your designs. Showcase apparel with photorealistic templates.',
//     image: '/Tank-top-mockup.webp',
//   },
//   {
//     title: 'Poster Mockups',
//     description:
//       'Download high-quality 100+ Poster mockups in parking, studio, wall, living room and with models.',
//     image: '/Poster-Mockups-1.webp',
//   },
//   {
//     title: 'Sweatshirt Mockups',
//     description:
//       '100+ Sweatshirt mockups with unique images of models, men and women, as well as groups.',
//     image: '/Sweatshirt-Mockup-1.webp',
//   },
//   {
//     title: 'Tshirt Mockups',
//     description:
//       'Design & Download free T-Shirt Mockups. Get professional quality photos of men, women, and groups for t-shirt mockups.',
//     image: '/free-tshirt-mockups.webp',
//   },
// ];

// export default function MockupsPage() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-bold mb-4">Free Mockups For Every Use Case</h2>
//       <p className="text-gray-700 mb-8 max-w-3xl">
//         Be it t-shirt, hoodie, sticker, or you need a custom mockups as per your unique needs, we got you covered with
//         thousands of free design templates! Signup for <span className="text-pink-500">Mockey Enterprise</span> to get custom templates on demand.
//       </p>
//       <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {mockups.map(({ title, description, image }) => (
//           <div key={title} className="text-center">
//             <div className="rounded-3xl overflow-hidden mx-auto w-32 h-40 relative">
//               <Image
//                 src={image}
//                 alt={title}
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-3xl"
//               />
//             </div>
//             <h3 className="text-lg font-semibold mt-4">{title}</h3>
//             <p className="text-gray-600 mt-2 text-sm max-w-xs mx-auto">{description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import Image from 'next/image';

const mockups = [
  {
    title: 'Hoodie Mockups',
    description: '100+ Hoodie mockups with stunning photos of models, men & women, and more.',
    image: '/Hoodie-Mockup.webp',
  },
  {
    title: 'Tanktop Mockups',
    description: 'Download stylish 100+ tank top mockups for your designs.',
    image: '/Tank-top-mockup.webp',
  },
  {
    title: 'Poster Mockups',
    description: 'Download high-quality 100+ poster mockups in parking, studios, etc.',
    image: '/Poster-Mockups-1.webp',
  },
  {
    title: 'Sweatshirt Mockups',
    description: '100+ Sweatshirt mockups with unique images of models and groups.',
    image: '/Sweatshirt-Mockup-1.webp',
  },
  {
    title: 'Tshirt Mockups',
    description: 'Design & Download free T-Shirt Mockups for professional results.',
    image: '/free-tshirt-mockups.webp',
  },
];

export default function MockupSection() {
  return (
    <section className="px-6 py-12 w-2/3 mx-auto bg-white rounded-2xl text-center">
      <h2 className="text-3xl font-bold mb-2 text-start">Free Mockups For Every Use Case</h2>
      <p className="mb-8 text-start max-w-3xl text-gray-600">
        Be it t-shirt, hoodie, sticker, or you need a custom mockups as per your unique needs, we got you covered
        with thousands of free design templates! Signup for <span className="text-pink-500">Mockey Enterprise</span> to get custom templates on demand.
      </p>

      <div className="relative overflow-hidden">
        <div className="w-full max-w-full overflow-x-hidden">
          <div className="flex gap-6 animate-scroll w-max">
            {[...mockups, ...mockups].map((mockup, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-4 text-center "
              >
                <Image
                  src={mockup.image}
                  alt={mockup.title}
                  width={200}
                  height={160}
                  className="rounded-xl mx-auto mb-4"
                />
                <h3 className="font-semibold text-black text-lg mb-2">{mockup.title}</h3>
                <p className="text-sm text-black">{mockup.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
