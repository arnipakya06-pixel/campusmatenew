import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  TrendingUp,
  Calendar,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendance, updateAttendance, markTodayAttendance, setActiveTab } = useCampusMate();

  const [leaveDaysInput, setLeaveDaysInput] = useState<number>(1);
  const [targetPercentageInput, setTargetPercentageInput] = useState<number>(80);

  const present = attendance.presentDays;
  const working = attendance.workingDays;
  const absent = working - present;
  const currentPct = Number(((present / working) * 100).toFixed(2));
  const isSafe = currentPct >= attendance.requiredPercentage;

  // Leave Impact Math
  // If student takes L days of leave, working days increase by L, present days stay same.
  const projectedWorkingAfterLeave = working + leaveDaysInput;
  const projectedPctAfterLeave = Number(
    ((present / projectedWorkingAfterLeave) * 100).toFixed(2)
  );
  const isLeaveSafe = projectedPctAfterLeave >= attendance.requiredPercentage;

  // Maximum Safe Leaves Calculation
  // Solve: present / (working + X) >= 0.75
  // present >= 0.75 * working + 0.75 * X
  // X <= (present - 0.75 * working) / 0.75
  const maxSafeLeaves = Math.max(0, Math.floor((present - (attendance.requiredPercentage / 100) * working) / (attendance.requiredPercentage / 100)));

  // Target Attendance Math
  // To reach target T (e.g. 0.80): (present + Y) / (working + Y) >= T
  // present + Y >= T*working + T*Y
  // Y * (1 - T) >= T*working - present
  // Y = ceil((T * working - present) / (1 - T))
  const targetFraction = targetPercentageInput / 100;
  let daysNeededForTarget = 0;
  if (currentPct >= targetPercentageInput) {
    daysNeededForTarget = 0;
  } else if (targetFraction >= 1) {
    daysNeededForTarget = Infinity;
  } else {
    const rawDays = (targetFraction * working - present) / (1 - targetFraction);
    daysNeededForTarget = Math.max(0, Math.ceil(rawDays));
  }

  // SVG Circular progress values
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPct / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Strict Institution Policy: One Attendance Record Per Whole Day</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Attendance Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time percentage calculations, leave impact projections, and target recovery planner
          </p>
        </div>

        {/* Quick simulator buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => markTodayAttendance('present')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Present (+1 Day)</span>
          </button>
          <button
            onClick={() => markTodayAttendance('absent')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
          >
            <Minus className="w-4 h-4" />
            <span>Mark Absent</span>
          </button>
        </div>
      </div>

      {/* Main Metric Banner & Circular Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Circular Gauge Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Active colored progress ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${isSafe ? 'text-indigo-600' : 'text-rose-500'} transition-all duration-700 ease-out`}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${isSafe ? 'text-slate-900' : 'text-rose-600'}`}>
                {currentPct}%
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Current
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                isSafe
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {isSafe ? 'Safe (Above 75%)' : 'Shortage Warning (< 75%)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Required Minimum: <strong>75.00%</strong> for semester hall ticket eligibility.
          </p>
        </div>

        {/* Detailed Breakdown Counters */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Present Days
              </span>
              <p className="text-3xl font-extrabold text-indigo-950 mt-1">{present}</p>
              <span className="text-[11px] text-indigo-700/80 mt-1 block">Attended full-day</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Working
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{working}</p>
              <span className="text-[11px] text-slate-500 mt-1 block">Official term days</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Absent Days
              </span>
              <p className="text-3xl font-extrabold text-rose-950 mt-1">{absent}</p>
              <span className="text-[11px] text-rose-700/80 mt-1 block">Leaves recorded</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Safe Leave Bank
              </span>
              <p className="text-3xl font-extrabold text-emerald-950 mt-1">{maxSafeLeaves}</p>
              <span className="text-[11px] text-emerald-700/80 mt-1 block">Days safe before 75%</span>
            </div>
          </div>

          {/* Institutional Policy Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-600">
            <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Whole-Day Attendance System Notice:</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Our institution marks attendance once daily for the entire morning &amp; afternoon session combined. There is no subject-wise hourly tracking. The percentage is calculated strictly as:{' '}
                <code className="font-mono font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  (Present Days / Total Working Days) × 100
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Essential Interactive Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculator 1: Leave Impact Calculator */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Leave Impact Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Simulate taking upcoming leaves to project your future standing
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Number of Planned Leave Days:</span>
                <span className="text-base font-extrabold text-indigo-600">
                  {leaveDaysInput} {leaveDaysInput === 1 ? 'day' : 'days'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={leaveDaysInput}
                onChange={(e) => setLeaveDaysInput(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 day</span>
                <span>5 days</span>
                <span>10 days</span>
              </div>
            </div>

            {/* Projected Output Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLeaveSafe
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Projected Attendance
                  </span>
                  <p className="text-3xl font-black mt-0.5">{projectedPctAfterLeave}%</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 ${
                    isLeaveSafe ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isLeaveSafe ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {isLeaveSafe ? 'SAFE' : 'SHORTAGE WARNING'}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/50 text-xs space-y-1">
                <p>
                  Formula: {present} present / {projectedWorkingAfterLeave} working days × 100 ={' '}
                  <strong>{projectedPctAfterLeave}%</strong>
                </p>
                <p className="text-slate-600 text-[11px]">
                  {isLeaveSafe
                    ? `✅ Taking ${leaveDaysInput} day(s) leave keeps you safely above the 75% required threshold.`
                    : `⚠️ Warning: Taking ${leaveDaysInput} day(s) leave causes your attendance to drop below 75%, risking exam disqualification.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: Attendance Target Calculator */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Attendance Target Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Calculate consecutive days needed to raise your attendance percentage
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Choose Target Attendance Goal:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[75, 80, 85, 90].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setTargetPercentageInput(goal)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      targetPercentageInput === goal
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {goal}%
                  </button>
                ))}
              </div>
            </div>

            {/* Target Output Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    Consecutive Days Needed
                  </span>
                  <p className="text-3xl font-black text-blue-950 mt-0.5">
                    {daysNeededForTarget === 0
                      ? 'Already Achieved!'
                      : `${daysNeededForTarget} Days`}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-900/90 leading-relaxed">
                {daysNeededForTarget === 0 ? (
                  <p>Your current attendance ({currentPct}%) already meets or exceeds your {targetPercentageInput}% goal.</p>
                ) : (
                  <p>
                    You must attend <strong>{daysNeededForTarget} consecutive working days</strong> with zero absences to elevate your attendance from {currentPct}% to {targetPercentageInput}%.
                    <span className="block mt-1 font-mono text-[11px] text-blue-800">
                      ({present} + {daysNeededForTarget}) / ({working} + {daysNeededForTarget}) ={' '}
                      {(((present + daysNeededForTarget) / (working + daysNeededForTarget)) * 100).toFixed(2)}%
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Trend Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Recent Day-by-Day Attendance Log
            </h3>
            <p className="text-xs text-slate-500">Whole-day verification records</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Current: {present} Present / {working} Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {attendance.history.slice(0, 8).map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center ${
                item.status === 'present'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                {item.dayName.slice(0, 3)}
              </span>
              <span className="text-xs font-extrabold block my-0.5">{item.date.slice(5)}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                  item.status === 'present'
                    ? 'bg-emerald-200/70 text-emerald-900'
                    : 'bg-rose-200/70 text-rose-900'
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
