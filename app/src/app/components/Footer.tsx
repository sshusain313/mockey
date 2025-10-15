'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FAQSection() {
  return (
    <>
      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Mockups</h4>
            <ul className="space-y-2">
              <li><Link href="#">Apparel</Link></li>
              <li><Link href="#">Accessories</Link></li>
              <li><Link href="#">Home & Living</Link></li>
              <li><Link href="#">Tech</Link></li>
              <li><Link href="#">3d Mockup</Link></li>
              <li><Link href="#">Custom Mockup</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#">Shopify App</Link></li>
              <li><Link href="#">Figma Plugin</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Play Store</Link></li>
              <li><Link href="#">Transparent Background</Link></li>
              <li><Link href="#">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Social</h4>
            <ul className="space-y-2">
              <li><Link href="#">Twitter</Link></li>
              <li><Link href="#">LinkedIn</Link></li>
              <li><Link href="#">Facebook</Link></li>
              <li><Link href="#">Instagram</Link></li>
              <li><Link href="#">Behance</Link></li>
              <li><Link href="#">Dribbble</Link></li>
              <li><Link href="#">Discord</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Licenses</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Advertise</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Tools</h4>
            <ul className="space-y-2">
              <li><Link href="#">AI Background Remover</Link></li>
              <li><Link href="#">Blur background</Link></li>
              <li><Link href="#">AI Filter</Link></li>
              <li><Link href="#">Profile Picture Maker</Link></li>
              <li><Link href="#">Image cropper</Link></li>
              <li><Link href="#">AI Art Generator</Link></li>
              <li><Link href="#">AI Product Photography</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10 flex flex-row justify-between items-center text-sm text-gray-400">
          <Image src="/shelfmerch.png" alt="Mockey" width={100} height={40} />
          <p className="mt-4">© 2025 Mockey.ai All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
