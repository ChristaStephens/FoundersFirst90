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
      <div className="w-full max-w-sm mx-auto px-2">
        <div className="flex justify-around items-center py-3">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isClicked = clickedTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 hover:scale-105 flex-1 max-w-[80px]",
                  isActive
                    ? "bg-[#FF6B35] text-white shadow-lg scale-105"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                  isClicked && "animate-pulse"
                )}
                data-testid={`nav-${tab.id}`}
              >
                {/* Icon */}
                <span className={cn(
                  "text-xl mb-1 transition-all duration-200",
                  isActive ? "text-white" : "text-gray-500"
                )}>
                  {tab.icon}
                </span>
                
                {/* Label */}
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "text-white font-bold" : "text-gray-500"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
