// export default function Appearl() {
//     const steps = [
//         {
//           icon: <img src="/icons/icon-upload-design.svg" alt="Upload Design" className="w-12 h-12 mx-auto mb-4" />,
//           title: "Upload your design",
//           desc: "Upload your designs in PNG or JPG format. Use transparent images for professional mockup images.",
//         },
//         {
//           icon: <img src="/icons/uploaddesign.svg" alt="Customize" className="w-12 h-12 mx-auto mb-4" />,
//           title: "Customize",
//           desc: "Use the editor to drag & drop designs, use AI background images, and customize as per your requirements.",
//         },
//         {
//           icon: <img src="/icons/icon-download-mockup.svg" alt="Download Mockup" className="w-12 h-12 mx-auto mb-4" />,
//           title: "Download",
//           desc: "Download free professional mockups for social media, ads, e-commerce, or your project. There’s no limit on free downloads.",
//         },
//       ];

//   return (
//     <main className="px-4 py-12 max-w-7xl mx-auto text-gray-800">
//       {/* Section: Weekly Drop + Categories */}
//       <section className="grid md:grid-cols-2 gap-12 mb-20">
//         <div>
//           <h2 className="text-2xl font-bold mb-3">We drop weekly mockups</h2>
//           <p className="text-gray-600">
//             In the dynamic world of design, stagnation is not an option. Embrace innovation with our updated mockups, meticulously refined and refreshed every week.
//           </p>
//         </div>
//         <div className="flex flex-col items-start md:items-end gap-3 text-xl font-bold text-black">
//           <a href="#" className="hover:underline">Apparel ↗</a>
//           <a href="#" className="hover:underline">Accessories ↗</a>
//           <a href="#" className="hover:underline">Home & Living ↗</a>
//           <a href="#" className="hover:underline">Tech ↗</a>
//         </div>
//       </section>

//       {/* Section: How It Works */}
//       <section className="text-center mb-20">
//         <h2 className="text-2xl font-bold">How Mockey Works?</h2>
//         <p className="text-gray-600 mt-1 mb-10">3 Simple Steps to Create AI Mock ups free:</p>

//         <div className="grid md:grid-cols-3 gap-6">
//           {steps.map(({ icon, title, desc }) => (
//             <div key={title} className="bg-gray-100 rounded-xl p-6">
//               <div className="text-4xl mb-4">{icon}</div>
//               <h3 className="font-semibold text-lg mb-2">{title}</h3>
//               <p className="text-sm text-gray-600">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }

import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { PiImageThin, PiMagicWandThin, PiDownloadSimpleThin } from "react-icons/pi";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-8 py-16 flex flex-col items-center">
      {/* Header Text and Categories */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full mb-16">
        <div>
          <h2 className="font-['Bricolage_Grotesque'] text-[60px] leading-[60px] font-bold text-[#000000] tracking-normal mb-2">We drop weekly mockups</h2>
          <p className="text-gray-600">
            In the dynamic world of design, stagnation is not an option. Embrace innovation with our updated mockups, meticulously refined and refreshed every week.
          </p>
        </div>

        <div className="flex flex-col text-right space-y-1 text-2xl md:text-3xl font-bold">
          {[
            { name: "Apparel", path: "/apparel/tshirt" },
            { name: "Accessories", path: "/accessories/totebag" },
            { name: "Home & Living", path: "/home-living/can" },
            { name: "Tech", path: "/tech/iphone" }
          ].map((item) => (
            <Link href={item.path} key={item.name}>
              <div className="inline-flex justify-end items-center space-x-2 group hover:text-green-600 transition cursor-pointer">
                <span>{item.name}</span>
                <FaArrowUpRightFromSquare className="text-base opacity-80 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="w-full max-w-6xl h-full flex flex-col items-start py-16 px-4">
        <h2 className="font-['Bricolage_Grotesque'] text-[40px] leading-[60px] font-bold text-[#000000] tracking-normal mb-1">How Mockey Works?</h2>
        <p className="text-gray-600 mb-6">3 Simple Steps to Create AI Mock ups free:</p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {/* Step 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-28 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
            {/* <PiImageThin className="text-green-400 text-6xl mx-auto mb-6" /> */}
            <Image src='/upload.svg' alt='download' width={50} height={50} className="text-green-400 text-6xl mx-auto mb-6" />
            <h3 className="font-semibold text-xl mb-3">Upload your design</h3>
            <p className="text-gray-600 text-sm">
              Upload your designs in PNG or JPG format. Use transparent images for professional mockup images.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-28 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
          <Image src='/customize.svg' alt='download' width={50} height={50} className="text-green-400 text-6xl mx-auto mb-6" />
            <h3 className="font-semibold text-xl mb-3">Customise</h3>
            <p className="text-gray-600 text-sm">
              Use the editor to drag & drop designs, use AI background images, and customize as per your requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-28 flex flex-col items-center justify-center text-center h-full min-h-[340px]">
          <Image src='/fownload.svg' alt='download' width={50} height={50} className="text-green-400 text-6xl mx-auto mb-6" />
            <h3 className="font-semibold text-lg mb-2">Download</h3>
            <p className="text-gray-600 text-sm">
              Download free professional mockups for social media, ads, e-commerce, or your project. There’s no limit on free downloads.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
