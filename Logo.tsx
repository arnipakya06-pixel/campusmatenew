import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 p-2.5">
        <GraduationCap className={size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6'} />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 ring-2 ring-white">
          <Sparkles className="w-2 h-2 text-indigo-950" />
        </span>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl font-sans">
              Campus<span className="text-indigo-600">Mate</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">
              Expo
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide -mt-0.5">
            Your Smart College Companion
          </span>
        </div>
      )}
    </div>
  );
};
