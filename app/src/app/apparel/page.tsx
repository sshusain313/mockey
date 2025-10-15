'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ApparelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Apparel Mockups</h1>
      <p className="text-gray-600 mb-8">
        Choose from our wide range of apparel mockups to showcase your designs. We offer high-quality mockups for t-shirts, hoodies, tank tops, and more.
      </p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Apparel</TabsTrigger>
          <TabsTrigger value="tshirt">T-Shirts</TabsTrigger>
          <TabsTrigger value="hoodie">Hoodies</TabsTrigger>
          <TabsTrigger value="tanktop">Tank Tops</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* T-Shirt Card */}
            <Link href="/apparel/tshirt" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-60">
                  <Image 
                    src="/apparel/tshirt-card.jpg" 
                    alt="T-Shirt Mockups"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">T-Shirts</h3>
                  <p className="text-gray-600">Classic t-shirt mockups for all your design needs.</p>
                </div>
              </div>
            </Link>
            
            {/* Hoodie Card */}
            <Link href="/apparel/hoodie" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-60">
                  <Image 
                    src="/apparel/hoodie-card.jpg" 
                    alt="Hoodie Mockups"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Hoodies</h3>
                  <p className="text-gray-600">Comfortable hoodie mockups for casual and streetwear designs.</p>
                </div>
              </div>
            </Link>
            
            {/* Tank Top Card */}
            <Link href="/apparel/tanktop" className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-60">
                  <Image 
                    src="/apparel/tanktop-card.jpg" 
                    alt="Tank Top Mockups"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Tank Tops</h3>
                  <p className="text-gray-600">Sleeveless tank top mockups perfect for summer designs.</p>
                </div>
              </div>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="tshirt" className="mt-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">T-Shirt Mockups</h2>
            <p className="text-gray-600 mb-6">Our collection of high-quality t-shirt mockups for your designs.</p>
            <Link href="/apparel/tshirt" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              View T-Shirt Mockups
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="hoodie" className="mt-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Hoodie Mockups</h2>
            <p className="text-gray-600 mb-6">Explore our premium hoodie mockups for your brand.</p>
            <Link href="/apparel/hoodie" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              View Hoodie Mockups
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="tanktop" className="mt-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Tank Top Mockups</h2>
            <p className="text-gray-600 mb-6">Discover our sleeveless tank top mockups for your summer collections.</p>
            <Link href="/apparel/tanktop" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              View Tank Top Mockups
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
