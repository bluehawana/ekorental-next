'use client';

import Toaster from './Toaster';

export default function ToasterWrapper() {
  return (
    <Toaster 
      message="Toaster opened"
      isVisible={true}
      onClose={() => console.log('Toaster closed')}
    />
  );
} 