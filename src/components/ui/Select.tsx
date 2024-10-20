import React, { useState } from 'react';

interface SelectProps {
  label?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{ onChange: (value: string) => void } | undefined>(undefined);

export const Select: React.FC<SelectProps> = ({ label, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <SelectContext.Provider value={{ onChange: handleSelect }}>
      <div className="flex flex-col mb-4 relative">
        {label && <label className="mb-1 text-gray-700">{label}</label>}
        <div className="relative">
          <div
            className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selectedValue ? selectedValue : 'Select an option'}
          </div>
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {children}
            </div>
          )}
        </div>
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-between">{children}</div>
);

export const SelectValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-gray-900">{children}</span>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-1">{children}</div>
);

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('SelectItem must be used within a Select');
  }
  const { onChange } = context;
  return (
    <div
      className="px-4 py-2 text-gray-900 hover:bg-gray-200 cursor-pointer"
      onClick={() => {
        onChange(value);
      }}
    >
      {children}
    </div>
  );
};
