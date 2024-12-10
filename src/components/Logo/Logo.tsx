import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center">
      <img 
        src="https://storage.googleapis.com/my-website-bucketstrona/Projekt%20bez%20nazwy%20(1).svg"
        alt="DziałkiZaMniej" 
        className="h-10 w-auto"
        style={{
          filter: 'none',
          backgroundColor: 'transparent',
          mixBlendMode: 'normal'
        }}
      />
    </div>
  );
};