'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductMultiViewUploadProps {
  onFrontImageUpload: (imageUrl: string) => void;
  onBackImageUpload: (imageUrl: string) => void;
  onSideImageUpload: (imageUrl: string) => void;
  frontImage?: string | null;
  backImage?: string | null;
  sideImage?: string | null;
}

const ProductMultiViewUpload: React.FC<ProductMultiViewUploadProps> = ({
  onFrontImageUpload,
  onBackImageUpload,
  onSideImageUpload,
  frontImage,
  backImage,
  sideImage,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadCallback: (imageUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        uploadCallback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderImageUploader = (
    title: string,
    imageUrl: string | null | undefined,
    inputRef: React.RefObject<HTMLInputElement | null>,
    onUpload: (imageUrl: string) => void,
    onRemove: () => void
  ) => {
    return (
      <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        
        {imageUrl ? (
          <div className="relative w-full h-48 mb-2">
            <Image
              src={imageUrl}
              alt={`${title} preview`}
              fill
              className="object-contain"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center mb-2 border-2 border-dashed border-gray-300 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => handleFileUpload(e, onUpload)}
          accept="image/*"
          className="hidden"
        />
        
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {imageUrl ? 'Change Image' : 'Upload Image'}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Product Images (3D Views)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderImageUploader(
          'Front View',
          frontImage,
          frontInputRef,
          onFrontImageUpload,
          () => onFrontImageUpload('')
        )}
        
        {renderImageUploader(
          'Back View',
          backImage,
          backInputRef,
          onBackImageUpload,
          () => onBackImageUpload('')
        )}
        
        {renderImageUploader(
          'Side View',
          sideImage,
          sideInputRef,
          onSideImageUpload,
          () => onSideImageUpload('')
        )}
      </div>
    </div>
  );
};

export default ProductMultiViewUpload;
