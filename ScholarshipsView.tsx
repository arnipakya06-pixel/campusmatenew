import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { Scholarship } from '../../types';
import {
  Award,
  Calendar,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const ScholarshipsView: React.FC = () => {
  const { student, scholarships, updateScholarshipStatus, setActiveTab } = useCampusMate();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState<boolean>(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const categories = ['All', 'Academic', 'Government', 'Private', 'Department'];

  const filteredScholarships = scholarships.filter((s) => {
    if (categoryFilter === 'All') return true;
    return s.category === categoryFilter;
  });

  // Eligibility evaluation for Abisha
  const evaluateEligibility = (sch: Scholarship) => {
    const cgpaOk = !sch.minCgpa || student.currentCgpa >= sch.minCgpa;
    return {
      eligible: cgpaOk,
      cgpaMet: cgpaOk,
      details: cgpaOk
        ? `Your CGPA (${student.currentCgpa.toFixed(2)}) satisfies the minimum requirement of ${sch.minCgpa || 7.0}.`
        : `Your CGPA (${student.currentCgpa.toFixed(2)}) is below the required ${sch.minCgpa}.`,
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Eligibility Check Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Financial Aid &amp; Merit Support Portal</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover institutional and external grants with automated eligibility matching for {student.name}
          </p>
        </div>

        <button
          onClick={() => setEligibilityModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Check My Eligibility</span>
        </button>
      </div>

      {/* Mandatory Demo Data Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-amber-900">Official Prototype Notice:</strong>{' '}
          All scholarship schemes presented below are structured <strong>DEMO DATA</strong> for college project expo demonstration. In production deployment, verified live API feeds from National Scholarship Portal (NSP) and state welfare boards are connected.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scholarship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScholarships.map((sch) => {
          const evalResult = evaluateEligibility(sch);
          return (
            <div
              key={sch.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sch.category} Grant
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                      {sch.name}
                    </h2>
                    <p className="text-xs text-slate-500">{sch.provider}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base sm:text-lg font-black text-indigo-600">
                      {sch.amount}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400">
                      Annual Grant
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{sch.description}</p>

                {/* Eligibility criteria highlight */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Eligibility:</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        evalResult.eligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {evalResult.eligible ? '✅ You Meet Criteria' : 'Requires Review'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{sch.eligibility}</p>
                </div>

                {/* Required Documents */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Required Documents:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sch.requiredDocuments.map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-indigo-50/70 text-indigo-900 border border-indigo-100"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Deadline + Application Status */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>
                    Deadline: <strong className="text-slate-800">{sch.deadline}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sch.status}
                    onChange={(e) =>
                      updateScholarshipStatus(sch.id, e.target.value as Scholarship['status'])
                    }
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      sch.status === 'Submitted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : sch.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="Not Applied">Status: Not Applied</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Submitted">Status: Submitted</option>
                  </select>

                  <button
                    onClick={() => {
                      updateScholarshipStatus(sch.id, 'In Progress');
                      setActiveTab('documents');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    Attach Docs
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* “Check My Eligibility” Modal */}
      {eligibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base sm:text-lg">
                  Automated Scholarship Match for Abisha
                </h3>
              </div>
              <button
                onClick={() => setEligibilityModalOpen(false)}
                className="p-1 rounded-md hover:bg-white/20 text-white/80"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Profile Inputs</span>
                <p className="font-extrabold text-slate-800">
                  {student.name} • {student.department} • CGPA: {student.currentCgpa.toFixed(2)} (Sem 1-4)
                </p>
                <p className="text-slate-500 text-xs">
                  Academic standing exceeds the 75% (7.50 CGPA) merit cutoff threshold.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Matched Scholarships:
                </h4>
                {scholarships.map((sch) => {
                  const evalResult = evaluateEligibility(sch);
                  return (
                    <div
                      key={sch.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{sch.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{sch.amount} • Due {sch.deadline}</p>
                        <p className="text-[11px] text-emerald-700 mt-1">{evalResult.details}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex-shrink-0">
                        Eligible
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setEligibilityModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
              >
                Close Matcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
