import React from 'react';

interface LogoImageProps {
  className?: string;
}

export const LogoImage = ({ className = "h-12" }: LogoImageProps) => {
  return (
    <img 
      src="https://storage.googleapis.com/my-website-bucketstrona/Projekt%20bez%20nazwy%20(1).svg"
      alt="DziałkiZaMniej" 
      className={`${className} w-auto object-contain`}
      style={{
        filter: 'none',
        backgroundColor: 'transparent',
        mixBlendMode: 'normal'
      }}
    />
  );
};