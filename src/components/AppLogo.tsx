import React from 'react';

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className = '' }: AppLogoProps) {
  return (
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border text-primary shadow-xs cursor-pointer transition-colors hover:border-primary/45 ${className}`}>
      <svg className="w-5.5 h-5.5 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Back Card (Ideas / Amber workspace color) - flat depth */}
        <rect 
          x="3.5" 
          y="3.5" 
          width="12" 
          height="12" 
          rx="2.5" 
          className="fill-amber-500/10 stroke-amber-500/80 dark:stroke-amber-400" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
        <path d="M7 7H11.5" className="stroke-amber-500/80 dark:stroke-amber-400" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 10.5H10" className="stroke-amber-500/80 dark:stroke-amber-400" strokeWidth="1.8" strokeLinecap="round" />
        
        {/* Front Card (Active Post Layout / Violet-Primary color) - flat depth offset */}
        <rect 
          x="8.5" 
          y="8.5" 
          width="12" 
          height="12" 
          rx="2.5" 
          className="fill-card stroke-primary" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
        <path d="M12 12H17" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 15.5H15" className="stroke-primary" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
