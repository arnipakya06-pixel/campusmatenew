import React, { useEffect } from 'react';
import { ArrowLeft, Home, ChevronRight, CornerUpLeft } from 'lucide-react';
import { useCampusMate, TAB_NAMES } from '../../context/CampusMateContext';

export const PageNavHeader: React.FC = () => {
  const { activeTab, setActiveTab, goBack, history, previousTab } = useCampusMate();

  // Keyboard shortcut listener: Escape key triggers goBack
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape' && activeTab !== 'dashboard') {
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, goBack]);

  const currentTabName = TAB_NAMES[activeTab] || 'Page';
  const targetTab = previousTab || 'dashboard';
  const targetName = TAB_NAMES[targetTab] || 'Dashboard';

  // If on dashboard and no history, show subtle breadcrumb or nothing to keep clean
  if (activeTab === 'dashboard' && history.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-sm border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-2xs transition-all">
      {/* Back Button with destination target */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          title={`Go back to ${targetName} (Press Esc)`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all group cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-transform group-hover:-translate-x-1" />
          <span>Back to {targetName}</span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 ml-1">
            Esc
          </span>
        </button>

        {activeTab !== 'dashboard' && targetTab !== 'dashboard' && (
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            title="Return to Home Dashboard"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border border-slate-200/80 text-xs font-semibold transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}
      </div>

      {/* Breadcrumb Navigation Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 font-medium transition-colors hover:text-indigo-600 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : ''
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {activeTab !== 'dashboard' && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold max-w-[200px] truncate">
              {currentTabName}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};
