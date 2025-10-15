// // pages/index.tsx
// import React from 'react';

// export default function Video() {
//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
//       <div className="max-w-3xl w-full">
//         <h1 className="text-3xl font-bold mb-2">
//           Mockey’s <span className="underline">Quick Demo</span>
//         </h1>
//         <p className="text-gray-700 mb-6">
//           Take a look at this demo video to learn about the power of Mockey AI!
//         </p>

//         <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
//           <iframe
//             src="https://www.youtube.com/embed/STiLVcFrBLA"
//             title="Mockey AI Demo"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full h-full"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// }


// pages/index.tsx
import React from "react";

export default function Home() {
  return (
    <div className=" bg-white flex flex-col items-center justify-start px-4 py-6">
      {/* Heading Section */}
      <div className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-3xl font-bold">
          Mockey’s <span className="underline">Quick Demo</span>
        </h1>
        <p className="text-gray-700 mt-2">
          Take a look at this demo video to learn about the power of Mockey AI!
        </p>
      </div>

      {/* Fullscreen Responsive Video */}
      <div className="w-full flex-1 max-w-5xl">
        <div className="relative pb-[56.25%] h-0 w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/STiLVcFrBLA"
            title="Mockey AI Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
