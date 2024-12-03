import React from 'react';

// Define the ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg';
}

// Define the Button component using the ButtonProps interface
const Button: React.FC<ButtonProps> = ({ onClick, disabled, className, children }) => {
    return (
        <button onClick={onClick} disabled={disabled} className={className}>
            {children}
        </button>
    );
};

export default Button;
