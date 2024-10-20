'use client'
import React from 'react';

interface ToasterProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, isVisible, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gray-800 text-white p-4 rounded shadow-lg">
        <p>{message}</p>
        <button onClick={onClose} className="mt-2 text-gray-400 hover:text-white">Close</button>
      </div>
    </div>
  );
};

export default Toaster;
