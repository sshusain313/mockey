import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Shirt, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

const Edit = () => {
  return (
    <div className="flex flex-col gap-6 items-center w-56 h-screen bg-gray-100">
  <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-lg h-15 shadow text-lg font-medium w-full">
    Download <span className="ml-1">▾</span>
  </button>

  <div className="flex flex-col items-center space-y-2">
    <Image
      src="/w-tshirt.png"
      alt="Mockup Preview"
      width={200}
      height={200}
      className="rounded-md shadow-md"
    />
    <div className="bg-blue-50 mt-3 p-3 rounded-lg text-sm text-gray-800 text-center max-w-xs shadow">
      Convert any image into editable mockup, super fast! Start by uploading your image
    </div>
  </div>
</div>

  )
}

export default Edit
