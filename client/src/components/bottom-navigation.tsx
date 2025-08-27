import { cn } from "@/lib/utils";
import { useState } from "react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  
  const tabs = [
    { id: 'today', label: 'Today', icon: '📅', hoverAnimation: 'animate-wiggle' },
    { id: 'progress', label: 'Progress', icon: '📊', hoverAnimation: 'animate-float' },
    { id: 'store', label: 'Store', icon: '🏪', hoverAnimation: 'animate-heartbeat' },
    { id: 'community', label: 'Community', icon: '👥', hoverAnimation: 'animate-jello' },
    { id: 'settings', label: 'Settings', icon: '⚙️', hoverAnimation: 'animate-wiggle' },
  ];

  const handleTabClick = (tabId: string) => {
    setClickedTab(tabId);
    onTabChange(tabId);
    
    // Reset click animation after animation completes
    setTimeout(() => setClickedTab(null), 600);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isClicked = clickedTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "group relative flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105",
                  isActive
                    ? "text-primary bg-primary/10 shadow-sm animate-fadeInScale"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isClicked && "animate-rubberBand",
                  "hover-lift hover-glow"
                )}
                data-testid={`nav-${tab.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
                
                {/* Icon with hover animation */}
                <span 
                  className={cn(
                    "text-lg mb-1 transition-transform duration-200",
                    "group-hover:" + tab.hoverAnimation,
                    isActive && "animate-float"
                  )}
                >
                  {tab.icon}
                </span>
                
                {/* Label */}
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
                
                {/* Ripple effect on click */}
                {isClicked && (
                  <div className="absolute inset-0 rounded-lg bg-primary/20 animate-ping pointer-events-none" />
                )}
                
                {/* Glow effect for active tab */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom highlight bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
    </nav>
  );
}
