import React from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import {
  UserCheck,
  GraduationCap,
  BookOpen,
  Award,
  CalendarClock,
  Bell,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Calendar,
  Briefcase,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    student,
    attendance,
    semesters,
    scholarships,
    deadlines,
    assignments,
    notifications,
    timetable,
    setActiveTab,
    markTodayAttendance,
    history,
  } = useCampusMate();

  const attendancePct = Number(((attendance.presentDays / attendance.workingDays) * 100).toFixed(1));
  const isAttendanceSafe = attendancePct >= attendance.requiredPercentage;
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');
  const nearestDeadlines = [...deadlines]
    .filter((d) => !d.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter today's classes (Monday for demo timetable, or current day)
  const todayClasses = timetable.filter((c) => c.day === 'Monday');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {history.length > 0 && <BackButton variant="white" size="sm" />}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>CampusMate Intelligent Academic Hub</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {student.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              {student.department} • {student.year}, Section {student.section} • Student ID:{' '}
              <span className="font-mono font-semibold text-white">{student.studentId}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask CampusMate AI</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-xs transition-colors"
            >
              <span>Leave Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Smart Summary Recommendation Pill */}
      <div className="flex items-start sm:items-center gap-3 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 shadow-2xs">
        <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 flex-shrink-0 mt-0.5 sm:mt-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-bold text-amber-900 mr-1.5">CampusMate Recommendation:</span>
          <span className="text-amber-900/90">
            Complete your <strong>DBMS assignment</strong> due today by 5:00 PM and review the{' '}
            <strong>Merit Scholarship (₹50,000)</strong> closing in 18 days.
          </span>
        </div>
        <button
          onClick={() => setActiveTab('deadlines')}
          className="text-xs font-bold text-amber-900 hover:text-amber-800 underline underline-offset-2 flex-shrink-0 hidden sm:inline-block"
        >
          View Deadlines
        </button>
      </div>

      {/* 6 Essential Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Attendance */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              College Attendance
            </span>
            <div
              className={`p-2 rounded-xl ${
                isAttendanceSafe ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold ${
                isAttendanceSafe ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {attendancePct}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Required: {attendance.requiredPercentage}%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>
              {attendance.presentDays} present / {attendance.workingDays} working days
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                isAttendanceSafe
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800 font-bold'
              }`}
            >
              {isAttendanceSafe ? 'Safe' : 'Shortage'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Open Leave Impact Simulator</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Card 2: Current CGPA & Latest GPA */}
        <div
          onClick={() => setActiveTab('results')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Academic Standing
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {student.currentCgpa.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              CGPA (Sem 1-4)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>Latest Sem 4 GPA: <strong className="text-slate-800">{student.latestGpa.toFixed(2)}</strong></span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              Top 10%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
            <span>View GPA History &amp; OCR Scanner</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Card 3: Pending Assignments */}
        <div
          onClick={() => setActiveTab('academics')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assignments
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {pendingAssignments.length}
            </span>
            <span className="text-xs font-semibold text-amber-600">
              pending submission
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            Due today: <strong className="text-slate-800">DBMS Relational Calculus</strong>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600 group-hover:text-purple-700">
            <span>Open Assignment Tracker</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Card 4: Scholarships */}
        <div
          onClick={() => setActiveTab('scholarships')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Scholarships
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {scholarships.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              eligible opportunities
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            Next: <strong className="text-slate-800">Merit Scholarship (₹50k)</strong> on Oct 15
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-700">
            <span>Check My Eligibility</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Card 5: Upcoming Deadlines */}
        <div
          onClick={() => setActiveTab('deadlines')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Deadlines
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">
              {nearestDeadlines.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              in queue
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            🔴 Due Today: <strong className="text-slate-800">{nearestDeadlines[0]?.title || 'None'}</strong>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:text-rose-700">
            <span>View 4-Tier Reminder Schedule</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Card 6: Notifications */}
        <div
          onClick={() => setActiveTab('notices')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notifications &amp; Notices
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {unreadCount}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              unread alerts
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            Latest: Mandatory 75% attendance circular
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Open Notice Board</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* “My Day” Comprehensive Section */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              My Day Schedule &amp; Academic Focus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Today&apos;s lectures, lab sessions, pending submissions, and placement alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Monday Schedule
            </span>
            <button
              onClick={() => markTodayAttendance('present')}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              + Mark Present (+1 Day)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Lectures */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Today&apos;s Classes ({todayClasses.length})
            </h3>
            <div className="space-y-2.5">
              {todayClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.subject}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.faculty}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.type === 'Lab'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'Training'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                    <span className="font-semibold text-indigo-600">{item.time}</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {item.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines (Nearest 3) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-rose-600" />
              Nearest 3 Deadlines
            </h3>
            <div className="space-y-2.5">
              {nearestDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 leading-snug">{dl.title}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        dl.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dl.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Due {dl.date}</span>
                    <span className="bg-slate-200/70 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {dl.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placement & Scholarship Reminders */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Career &amp; Scholarship Radar
            </h3>
            <div className="space-y-2.5">
              {/* Drive reminder */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">FinTech Global Solutions</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    8.5 LPA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Role: Data Analyst • Drive: Oct 12, 2026</p>
                <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Eligibility: CGPA ≥ 7.0 (You: 8.29)</span>
                  <button
                    onClick={() => setActiveTab('career')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Take Skill Test
                  </button>
                </div>
              </div>

              {/* Scholarship reminder */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Women in STEM Scholarship</span>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    ₹60,000 / yr
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Deadline: Oct 30, 2026 • Status: In Progress</p>
                <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>CGPA Required: ≥ 8.0 (Matched)</span>
                  <button
                    onClick={() => setActiveTab('scholarships')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
