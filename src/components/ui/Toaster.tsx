'use client'
import React from 'react';

interface ToasterProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Toaster;
