import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
    return <div className={`card ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <h2 className="card-title">{children}</h2>;
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="card-header">{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="card-content">{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="card-footer">{children}</div>;
};
