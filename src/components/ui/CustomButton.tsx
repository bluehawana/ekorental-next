interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function CustomButton({ 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  children,
  ...props 
}: CustomButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50"
  const variants = {
    primary: "bg-white text-gray-900 hover:bg-gray-100",
    secondary: "bg-[#1C1C3A] text-white border border-gray-700 hover:bg-[#2A2A4A]",
    outline: "border border-gray-700 text-white hover:bg-gray-800"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 