import React from 'react';
import { ImageBlockData } from '@/types';

const ImageBlock: React.FC<ImageBlockData> = ({ src, alt }) => {
  return (
    <div className="flex justify-start items-center h-full">
      <img src={src} alt={alt} className="max-h-12 object-contain" />
    </div>
  );
};

export default ImageBlock;