import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useCampusMate, TAB_NAMES } from '../../context/CampusMateContext';
import { TabType } from '../../types';

interface BackButtonProps {
  label?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showDestination?: boolean;
  toTab?: TabType;
  className?: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  variant = 'default',
  size = 'md',
  showDestination = true,
  toTab,
  className = '',
  onClick,
}) => {
  const { goBack, previousTab, activeTab, setActiveTab } = useCampusMate();

  const targetTab = toTab || previousTab || 'dashboard';
  const targetName = TAB_NAMES[targetTab] || 'Dashboard';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
      return;
    }
    if (toTab) {
      setActiveTab(toTab);
    } else {
      goBack();
    }
  };

  const displayText =
    label || (showDestination && targetTab !== activeTab ? `Back to ${targetName}` : 'Back');

  // Variant styles
  let variantStyle = 'bg-white hover:bg-slate-100 text-slate-700 hover:text-indigo-600 border border-slate-200/90 shadow-2xs';
  if (variant === 'outline') {
    variantStyle = 'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-slate-300';
  } else if (variant === 'ghost') {
    variantStyle = 'bg-transparent hover:bg-slate-200/50 text-slate-600 hover:text-indigo-600';
  } else if (variant === 'light') {
    variantStyle = 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900';
  } else if (variant === 'white') {
    variantStyle = 'bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md';
  }

  // Size styles
  let sizeStyle = 'px-3 py-1.5 text-xs sm:text-sm gap-1.5';
  let iconSize = 'w-4 h-4';
  if (size === 'sm') {
    sizeStyle = 'px-2.5 py-1 text-xs gap-1';
    iconSize = 'w-3.5 h-3.5';
  } else if (size === 'lg') {
    sizeStyle = 'px-4 py-2 text-sm gap-2';
    iconSize = 'w-4.5 h-4.5';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Go back to ${targetName}`}
      className={`inline-flex items-center rounded-xl font-semibold transition-all group active:scale-95 cursor-pointer ${variantStyle} ${sizeStyle} ${className}`}
    >
      <ArrowLeft
        className={`${iconSize} transition-transform group-hover:-translate-x-1 shrink-0 ${
          variant === 'white' ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
        }`}
      />
      <span className="truncate">{displayText}</span>
    </button>
  );
};
