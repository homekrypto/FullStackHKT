import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface HKTLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'full' | 'compact';
  className?: string;
  showText?: boolean;
}

export default function HKTLogo({ 
  size = 'medium', 
  variant = 'compact', 
  className = '',
  showText = false 
}: HKTLogoProps) {
  // Create unique IDs for gradients and filters to avoid conflicts
  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return variant === 'compact' ? 'w-6 h-6' : 'w-8 h-8';
      case 'medium':
        return variant === 'compact' ? 'w-8 h-8' : 'w-12 h-12';
      case 'large':
        return variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16';
      case 'xl':
        return variant === 'compact' ? 'w-16 h-16' : 'w-24 h-24';
      default:
        return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'xl':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  const logoSvg = variant === 'compact' ? (
    <svg viewBox="0 0 40 40" className={cn(getSizeClasses(), className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`compactMainGrad-${uniqueId}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:'#e0e0e0', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#b0b0b0', stopOpacity:1}} />
        </radialGradient>
        
        <radialGradient id={`compactSmallGrad-${uniqueId}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" style={{stopColor:'#f8f8f8', stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:'#d8d8d8', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#a8a8a8', stopOpacity:1}} />
        </radialGradient>
        
        <filter id={`compactShadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
          <feOffset dx="1" dy="1" result="offset"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      {/* Central sphere */}
      <circle cx="20" cy="20" r="7" fill={`url(#compactMainGrad-${uniqueId})`} filter={`url(#compactShadow-${uniqueId})`}/>
      
      {/* Four corner spheres - perfectly symmetric */}
      <circle cx="10" cy="10" r="4" fill={`url(#compactSmallGrad-${uniqueId})`} filter={`url(#compactShadow-${uniqueId})`}/>
      <circle cx="30" cy="10" r="4" fill={`url(#compactSmallGrad-${uniqueId})`} filter={`url(#compactShadow-${uniqueId})`}/>
      <circle cx="10" cy="30" r="4" fill={`url(#compactSmallGrad-${uniqueId})`} filter={`url(#compactShadow-${uniqueId})`}/>
      <circle cx="30" cy="30" r="4" fill={`url(#compactSmallGrad-${uniqueId})`} filter={`url(#compactShadow-${uniqueId})`}/>
      
      {/* Four cardinal direction spheres - perfectly symmetric */}
      <circle cx="20" cy="6" r="2.5" fill={`url(#compactSmallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="34" cy="20" r="2.5" fill={`url(#compactSmallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="20" cy="34" r="2.5" fill={`url(#compactSmallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="6" cy="20" r="2.5" fill={`url(#compactSmallGrad-${uniqueId})`} opacity="0.8"/>
    </svg>
  ) : (
    <svg viewBox="0 0 120 120" className={cn(getSizeClasses(), className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`mainGrad-${uniqueId}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:'#e0e0e0', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#b0b0b0', stopOpacity:1}} />
        </radialGradient>
        
        <radialGradient id={`accentGrad-${uniqueId}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" style={{stopColor:'#f5f5f5', stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:'#d4d4d4', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#a0a0a0', stopOpacity:1}} />
        </radialGradient>
        
        <radialGradient id={`smallGrad-${uniqueId}`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" style={{stopColor:'#f8f8f8', stopOpacity:1}} />
          <stop offset="70%" style={{stopColor:'#d8d8d8', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#a8a8a8', stopOpacity:1}} />
        </radialGradient>
        
        <filter id={`shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="2" dy="2" result="offset"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer ring for reference */}
      <circle cx="60" cy="60" r="58" fill="none" stroke="#f0f0f0" strokeWidth="1" opacity="0.2"/>
      
      {/* Central main sphere */}
      <circle cx="60" cy="60" r="16" fill={`url(#mainGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      
      {/* Four cardinal direction spheres - perfectly symmetric */}
      <circle cx="60" cy="25" r="11" fill={`url(#accentGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="95" cy="60" r="11" fill={`url(#accentGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="60" cy="95" r="11" fill={`url(#accentGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="25" cy="60" r="11" fill={`url(#accentGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      
      {/* Four corner spheres at 45-degree angles - perfectly symmetric */}
      <circle cx="84.85" cy="35.15" r="7" fill={`url(#smallGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="84.85" cy="84.85" r="7" fill={`url(#smallGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="35.15" cy="84.85" r="7" fill={`url(#smallGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      <circle cx="35.15" cy="35.15" r="7" fill={`url(#smallGrad-${uniqueId})`} filter={`url(#shadow-${uniqueId})`}/>
      
      {/* Inner ring of small spheres - perfectly symmetric */}
      <circle cx="60" cy="40" r="4" fill={`url(#smallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="80" cy="60" r="4" fill={`url(#smallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="60" cy="80" r="4" fill={`url(#smallGrad-${uniqueId})`} opacity="0.8"/>
      <circle cx="40" cy="60" r="4" fill={`url(#smallGrad-${uniqueId})`} opacity="0.8"/>
      
      {/* Subtle connecting lines for network effect - perfectly symmetric */}
      <g opacity="0.08" stroke="#888" strokeWidth="1" fill="none">
        <line x1="60" y1="36" x2="60" y2="44"/>
        <line x1="60" y1="76" x2="60" y2="84"/>
        <line x1="44" y1="60" x2="36" y2="60"/>
        <line x1="76" y1="60" x2="84" y2="60"/>
      </g>
    </svg>
  );

  if (showText) {
    return (
      <div className="flex items-center gap-2">
        {logoSvg}
        <span className={cn('font-bold text-gray-900 dark:text-white', getTextSize())}>
          HKT
        </span>
      </div>
    );
  }

  return logoSvg;
}