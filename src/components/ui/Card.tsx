import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
            {children}
        </div>
    )
}

export const CardTitle: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <h2 className={cn("text-5xl font-bold tracking-tight", className)}>{children}</h2>;
};

export const CardHeader: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("card-header", className)}>{children}</div>;
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
                {children}
            </div>
        );
    }
);
CardContent.displayName = "CardContent";

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="card-footer">{children}</div>;
};
