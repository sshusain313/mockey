import Link from "next/link";

export function TShirtHeader() {
    return (
      <div className="p-6">
        <div className="mb-2">
          <div className="text-sm text-gray-500 mb-1">
            <span className="hover:text-blue-600 cursor-pointer"><Link href='/'>Mockups</Link></span> / 
            <span className="hover:text-blue-600 cursor-pointer"><Link href='/'>Apparel</Link></span> / 
            <span className="hover:text-blue-600 cursor-pointer"><Link href='/apparel/tshirt'>T-Shirt</Link></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">T-shirt Mockups Free Download - T-shirt Mockup Designs</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Create T-shirt Mockups for men, women, oversized, short or long-sleeve T-shirt with Mockey.
        </p>
      </div>
    );
  }
  
