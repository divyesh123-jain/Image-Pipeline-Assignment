import React from 'react';

interface ImagePairProps {
  originalImage: string;
  maskImage: string;
}

export const ImagePair: React.FC<ImagePairProps> = ({ originalImage, maskImage }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center mt-8">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Original Image</h3>
        <img
          src={originalImage}
          alt="Original"
          className="max-w-[300px] h-auto rounded-lg shadow-md"
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Mask Image</h3>
        <img
          src={maskImage}
          alt="Mask"
          className="max-w-[300px] h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};