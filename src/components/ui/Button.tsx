import React from 'react';

// Define the ButtonProps interface
interface ButtonProps {
    onClick: () => void; // Function to handle click events
    disabled?: boolean; // Optional prop to disable the button
    className?: string; // Optional className for styling
    children: React.ReactNode; // Children elements to be rendered inside the button
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
