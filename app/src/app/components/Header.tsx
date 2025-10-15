// import { CloudUpload } from 'lucide-react';

// export default function Header() {
//   return (
//     <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-pink-300 to-white text-center px-4">
//       <div className="max-w-5xl">
//         {/* Tags */}
//         <div className="mb-6 w-1/3 mx-auto flex justify-center gap-4 bg-white rounded-full p-2 shadow-md">
//           {['crisp', 'fast', 'smooth'].map((tag, index) => (
//             <span
//               key={tag}
//               className=" text-pink-500 font-semibold text-sm py-1"
//             >
//               {tag}
//               {index < 2 && <span className="mx-2 font-bold text-pink-400">•</span>}
//             </span>
//           ))}
//         </div>

//         {/* Heading */}
//         <h1 className="font-bricolage text-4xl sm:text-5xl font-extrabold text-black leading-tight mb-4">
//           Free Mockup Generator with <br /> 5000+ Mockup Templates
//         </h1>

//         {/* Subtext */}
//         <p className="text-gray-700 text-sm sm:text-base mb-8">
//           Create free product mockups with premium and unique templates. Free AI mockup generator with 45+ mockup categories <br />
//           including t-shirt mockups, accessories, iPhone and more.
//         </p>

//         {/* Upload Button */}
//         <button className="flex items-center gap-2 mx-auto bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-lg transition">
//           <CloudUpload className="w-5 h-5" />
//           Upload Design
//         </button>
//       </div>
//     </div>
//   );
// }

import { CloudUpload } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-green-300 to-white text-center px-4 py-12 sm:py-24">
      <div className="w-full max-w-5xl">
        {/* Tags */}
        <div className="mb-6 w-full sm:w-fit mx-auto flex flex-wrap justify-center gap-2 sm:gap-4 bg-white rounded-full p-2 shadow-md">
          {['crisp', 'fast', 'smooth'].map((tag, index) => (
            <span
              key={tag}
              className="text-green-500 font-semibold text-sm py-1"
            >
              {tag}
              {index < 2 && <span className="mx-1 font-bold text-green-400">•</span>}
            </span>
          ))}
        </div>

        {/* Heading */}
        <h1 className="font-['Bricolage_Grotesque'] text-[80px] leading-[60px] line-spacing-[0.02em] font-bold text-[#000000] tracking-normal mb-8">
          <div className='flex flex-col gap-5'><span>Free Mockup Generator with</span><span> 5000+ Mockup Templates</span></div>
        </h1>

        {/* Subtext */}
        <p className="text-gray-700 text-sm sm:text-base mb-8 px-2 sm:px-0">
          Create free product mockups with premium and unique templates. Free AI mockup generator with 45+ mockup categories
          including t-shirt mockups, accessories, iPhone and more.
        </p>

        {/* Upload Button */}
        <Link href='/apparel/tshirt'>
        <button className="flex items-center gap-2 mx-auto bg-green-500 hover:bg-green-600 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base">
          <CloudUpload className="w-5 h-5" />
          Upload Design
        </button>
        </Link>
      </div>
    </div>
  );
}
