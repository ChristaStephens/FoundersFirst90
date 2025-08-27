import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PlayfulButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
  animation?: 'wiggle' | 'heartbeat' | 'float' | 'jello' | 'rubberBand' | 'squish';
  hoverEffect?: 'lift' | 'grow' | 'glow' | 'rotate';
  'data-testid'?: string;
}

export function PlayfulButton({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default',
  className,
  disabled = false,
  animation = 'wiggle',
  hoverEffect = 'lift',
  'data-testid': dataTestId,
  ...props 
}: PlayfulButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    onClick?.();
    
    // Reset click animation after animation completes
    setTimeout(() => setIsClicked(false), 600);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      data-testid={dataTestId}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        `hover-${hoverEffect}`,
        `hover:animate-${animation}`,
        isClicked && 'animate-rubberBand',
        className
      )}
      {...props}
    >
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Click ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none rounded-md" />
      )}
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Button>
  );
}