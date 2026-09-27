import React, { useState, useEffect, useRef } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { TabType } from '../../types';
import {
  Search,
  X,
  Calendar,
  Award,
  FileText,
  MapPin,
  Bell,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    setActiveTab,
    scholarships,
    deadlines,
    assignments,
    notices,
    campusLocations,
    documents,
    achievements,
  } = useCampusMate();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      } else if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [globalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items across categories
  const matchedScholarships = scholarships.filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );
  const matchedDeadlines = deadlines.filter(
    (d) => !q || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
  );
  const matchedAssignments = assignments.filter(
    (a) => !q || a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)
  );
  const matchedNotices = notices.filter(
    (n) => !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
  );
  const matchedLocations = campusLocations.filter(
    (l) => !q || l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
  );
  const matchedDocuments = documents.filter(
    (doc) => !q || doc.name.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q)
  );
  const matchedAchievements = achievements.filter(
    (ach) => !q || ach.title.toLowerCase().includes(q) || ach.organization.toLowerCase().includes(q)
  );

  const totalResults =
    matchedScholarships.length +
    matchedDeadlines.length +
    matchedAssignments.length +
    matchedNotices.length +
    matchedLocations.length +
    matchedDocuments.length +
    matchedAchievements.length;

  const handleSelect = (tab: TabType) => {
    setActiveTab(tab);
    setGlobalSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scholarships, deadlines, timetable, campus map, documents..."
            className="flex-1 bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {totalResults === 0 ? (
            <div className="text-center py-12 px-4">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No college records found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;attendance&quot;, &quot;DBMS&quot;, &quot;scholarship&quot;, or &quot;library&quot;</p>
            </div>
          ) : (
            <>
              {/* Deadlines & Assignments */}
              {matchedDeadlines.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Deadlines ({matchedDeadlines.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedDeadlines.slice(0, 3).map((dl) => (
                      <button
                        key={dl.id}
                        onClick={() => handleSelect('deadlines')}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-indigo-50/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                            {dl.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Due {dl.date} • {dl.category}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scholarships */}
              {matchedScholarships.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    Scholarships ({matchedScholarships.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedScholarships.slice(0, 3).map((sch) => (
                      <button
                        key={sch.id}
                        onClick={() => handleSelect('scholarships')}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-emerald-50/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-700">
                            {sch.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {sch.amount} • Deadline: {sch.deadline}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Campus Locations */}
              {matchedLocations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Campus Map ({matchedLocations.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedLocations.slice(0, 3).map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleSelect('campus-map')}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-rose-50/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-rose-700">
                            {loc.name}
                          </p>
                          <p className="text-xs text-slate-500">{loc.floor} • {loc.timings}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {matchedNotices.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    Notices ({matchedNotices.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedNotices.slice(0, 2).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelect('notices')}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-amber-50/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-amber-700">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500">{n.category} • {n.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents & Academic */}
              {matchedDocuments.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    Documents ({matchedDocuments.length})
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedDocuments.slice(0, 2).map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleSelect('documents')}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-blue-50/60 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500">{doc.category} • {doc.fileSize}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Quick jump:</span>
            <button
              onClick={() => handleSelect('attendance')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Attendance (78%)
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelect('results')}
              className="text-indigo-600 hover:underline font-medium"
            >
              CGPA (8.29)
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelect('ai-assistant')}
              className="text-indigo-600 hover:underline font-medium"
            >
              AI Assistant
            </button>
          </div>
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="text-slate-400 hover:text-slate-600 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
