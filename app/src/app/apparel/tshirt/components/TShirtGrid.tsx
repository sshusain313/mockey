'use client';

import { useRouter } from "next/navigation";

interface TShirtGridProps {
  images: string[];
}

const TShirtGrid: React.FC<TShirtGridProps> = ({ images }) => {
  const router = useRouter();

  const handleImageClick = (image: string) => {
    // Use the app router navigation
    router.push(`/editor?image=${encodeURIComponent(image)}`);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`T-shirt ${index}`}
          className="cursor-pointer"
          onClick={() => handleImageClick(image)}
        />
      ))}
    </div>
  );
};

export default TShirtGrid;
