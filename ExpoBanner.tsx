import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { TabType } from '../../types';
import {
  Sparkles,
  UserCheck,
  GraduationCap,
  Award,
  CalendarClock,
  MapPin,
  Info,
  CheckCircle2,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const ExpoBanner: React.FC = () => {
  const { setActiveTab, presentationMode } = useCampusMate();
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const quickShortcuts: { label: string; tab: TabType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Attendance (Whole-Day)', tab: 'attendance', icon: UserCheck },
    { label: 'AI Result Scanner', tab: 'results', icon: GraduationCap },
    { label: 'Scholarship Matcher', tab: 'scholarships', icon: Award },
    { label: 'Deadlines & Reminders', tab: 'deadlines', icon: CalendarClock },
    { label: 'AI Campus Assistant', tab: 'ai-assistant', icon: Sparkles },
    { label: 'College Campus Map', tab: 'campus-map', icon: MapPin },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white px-4 sm:px-6 py-2.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold tracking-wide uppercase text-[11px] bg-white/15 px-2 py-0.5 rounded border border-white/20">
              CampusMate Expo Prototype
            </span>
            <span className="hidden md:inline text-indigo-100 font-medium">
              Live Connected Student Architecture • Abisha (3rd Year AI & DS)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="hidden lg:inline text-[11px] text-indigo-200 font-medium mr-1">
              Expo Quick Jumps:
            </span>
            {quickShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-all border border-white/15 flex-shrink-0"
                >
                  <Icon className="w-3 h-3 text-indigo-200" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setInfoModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-all ml-1 flex-shrink-0 shadow-xs"
            >
              <Info className="w-3 h-3" />
              <span>How It Works</span>
            </button>
          </div>
        </div>
      </div>

      {/* "How CampusMate Works" Modal for Expo Booth Visitors & Evaluators */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-200" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">How CampusMate Works</h3>
                  <p className="text-xs text-indigo-100">Project Expo System Architecture Overview</p>
                </div>
              </div>
              <button
                onClick={() => setInfoModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-600">
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-950">
                <p className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Unified Connected Student Engine
                </p>
                <p className="text-xs leading-relaxed text-indigo-900/80">
                  Unlike disparate portals for attendance, grades, and notices, CampusMate operates on a single synchronized state tree. An attendance update or deadline addition cascades instantly into dashboard metrics, AI answers, and warning alert centers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Whole-Day Attendance Math
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Replaces confusing subject-wise logs with the strict college single-record model:
                    <code className="block bg-slate-100 p-1.5 rounded text-[11px] text-slate-700 mt-1 font-mono">
                      (Present Days / Total Working Days) × 100
                    </code>
                    Simulates leave impacts (e.g., 78/100 → 1 leave = 77.23% Safe) and consecutive attendance targets.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Multimodal Result OCR Scanner
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Processes uploaded marksheet cards using Gemini vision models to extract subject codes, credits, and grade points with <strong>Mandatory User Verification</strong> before updating the student&apos;s cumulative CGPA.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
                    <CalendarClock className="w-4 h-4 text-indigo-600" />
                    Proactive 4-Tier Deadlines
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Automated smart reminder logic schedules 7-day, 3-day, 1-day (&quot;⚠️ Tomorrow&quot;), and Due Today (&quot;🔴 Due Today&quot;) alerts for assignments and scholarships.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Campus GIS Navigation
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vector-based college campus map featuring searchable department blocks, floor directories, walking route simulation, and verified emergency SOS hotlines.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs leading-relaxed">
                  <strong>Evaluator Note:</strong> Every calculator, modal, quiz, scanner, and navigation link in this prototype is fully functional with live demo student records (Abisha, 3rd Year AI &amp; DS).
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInfoModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                Close &amp; Explore
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
