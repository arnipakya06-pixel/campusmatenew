import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { Deadline } from '../../types';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  Trash2,
  MoreVertical,
  Calendar,
  X,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';

export const DeadlinesView: React.FC = () => {
  const {
    deadlines,
    addDeadline,
    toggleDeadline,
    snoozeDeadline,
    deleteDeadline,
    updateDeadline,
  } = useCampusMate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form states for new/edit
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Deadline['category']>('Assignment');
  const [formDate, setFormDate] = useState('2026-10-05');
  const [formTime, setFormTime] = useState('17:00');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState<Deadline['priority']>('High');

  const todayStr = '2026-09-27'; // Consistent demo date matching prompt environment

  // Helper to categorize deadlines relative to todayStr
  const getGroup = (d: Deadline): 'completed' | 'today' | 'tomorrow' | 'this_week' | 'later' => {
    if (d.completed) return 'completed';
    if (d.date === todayStr) return 'today';

    const todayDate = new Date(todayStr);
    const itemDate = new Date(d.date);
    const diffTime = itemDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'tomorrow';
    if (diffDays > 1 && diffDays <= 7) return 'this_week';
    return 'later';
  };

  // Helper for automatic 4-tier reminder badge
  const getReminderLabel = (d: Deadline) => {
    if (d.completed) return null;
    const todayDate = new Date(todayStr);
    const itemDate = new Date(d.date);
    const diffDays = Math.ceil((itemDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: '🔴 Due today', color: 'bg-rose-600 text-white font-black' };
    }
    if (diffDays === 1) {
      return { text: '⚠️ Due tomorrow', color: 'bg-amber-500 text-white font-bold' };
    }
    if (diffDays <= 3) {
      return { text: `⏰ Due in ${diffDays} days`, color: 'bg-amber-100 text-amber-800' };
    }
    if (diffDays <= 7) {
      return { text: `🗓️ In ${diffDays} days`, color: 'bg-indigo-100 text-indigo-800' };
    }
    return { text: `In ${diffDays} days`, color: 'bg-slate-100 text-slate-600' };
  };

  const handleOpenAdd = () => {
    setEditingDeadline(null);
    setFormTitle('');
    setFormCategory('Assignment');
    setFormDate('2026-10-05');
    setFormTime('17:00');
    setFormDescription('');
    setFormPriority('High');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (dl: Deadline) => {
    setEditingDeadline(dl);
    setFormTitle(dl.title);
    setFormCategory(dl.category);
    setFormDate(dl.date);
    setFormTime(dl.time || '17:00');
    setFormDescription(dl.description);
    setFormPriority(dl.priority);
    setAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate) return;

    if (editingDeadline) {
      updateDeadline(editingDeadline.id, {
        title: formTitle,
        category: formCategory,
        date: formDate,
        time: formTime,
        description: formDescription,
        priority: formPriority,
      });
    } else {
      addDeadline({
        title: formTitle,
        category: formCategory,
        date: formDate,
        time: formTime,
        description: formDescription,
        priority: formPriority,
      });
    }

    setAddModalOpen(false);
  };

  const filteredDeadlines = deadlines.filter((d) => {
    if (filterCategory === 'All') return true;
    return d.category === filterCategory;
  });

  const todayList = filteredDeadlines.filter((d) => getGroup(d) === 'today');
  const tomorrowList = filteredDeadlines.filter((d) => getGroup(d) === 'tomorrow');
  const thisWeekList = filteredDeadlines.filter((d) => getGroup(d) === 'this_week');
  const laterList = filteredDeadlines.filter((d) => getGroup(d) === 'later');
  const completedList = filteredDeadlines.filter((d) => getGroup(d) === 'completed');

  const renderDeadlineCard = (dl: Deadline) => {
    const reminder = getReminderLabel(dl);
    return (
      <div
        key={dl.id}
        className={`p-4 rounded-2xl border transition-all ${
          dl.completed
            ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
            : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleDeadline(dl.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 transition-colors ${
                dl.completed
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-slate-300 hover:border-indigo-600 text-transparent hover:text-slate-300'
              }`}
              title={dl.completed ? 'Mark pending' : 'Mark complete'}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    dl.priority === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : dl.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {dl.priority} Priority
                </span>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {dl.category}
                </span>

                {reminder && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${reminder.color}`}>
                    {reminder.text}
                  </span>
                )}
              </div>

              <h4
                className={`text-sm font-bold mt-1.5 ${
                  dl.completed ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {dl.title}
              </h4>

              {dl.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dl.description}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {dl.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {dl.time || '23:59'}
                </span>
                {dl.snoozedUntil && (
                  <span className="text-amber-700 text-[11px] font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                    Snoozed to {dl.snoozedUntil}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => snoozeDeadline(dl.id, 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 text-xs font-semibold"
              title="Snooze 1 day"
            >
              +1d
            </button>
            <button
              onClick={() => snoozeDeadline(dl.id, 3)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-semibold"
              title="Snooze 3 days"
            >
              +3d
            </button>
            <button
              onClick={() => handleOpenEdit(dl)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Edit deadline"
            >
              Edit
            </button>
            <button
              onClick={() => deleteDeadline(dl.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Delete deadline"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60">
              <CalendarClock className="w-3.5 h-3.5 text-rose-600" />
              <span>Automated 4-Tier Escalation Alerts (7d → 3d → 1d → Due Today)</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Deadline Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Synchronized calendar for assignments, exams, scholarship submissions, and placement registrations
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deadline</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          Category:
        </span>
        {[
          'All',
          'Assignment',
          'Scholarship',
          'Exam',
          'Project',
          'Placement',
          'Competition',
          'Event',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped Deadline Sections */}
      <div className="space-y-6">
        {/* Section 1: Today */}
        {todayList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <h3 className="font-extrabold text-sm sm:text-base text-rose-950 uppercase tracking-wide">
                Due Today ({todayList.length})
              </h3>
            </div>
            <div className="space-y-2.5">{todayList.map(renderDeadlineCard)}</div>
          </div>
        )}

        {/* Section 2: Tomorrow */}
        {tomorrowList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-amber-950 uppercase tracking-wide">
                Due Tomorrow ({tomorrowList.length})
              </h3>
            </div>
            <div className="space-y-2.5">{tomorrowList.map(renderDeadlineCard)}</div>
          </div>
        )}

        {/* Section 3: This Week */}
        {thisWeekList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wide">
                This Week ({thisWeekList.length})
              </h3>
            </div>
            <div className="space-y-2.5">{thisWeekList.map(renderDeadlineCard)}</div>
          </div>
        )}

        {/* Section 4: Later */}
        {laterList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-700 uppercase tracking-wide">
                Upcoming Later ({laterList.length})
              </h3>
            </div>
            <div className="space-y-2.5">{laterList.map(renderDeadlineCard)}</div>
          </div>
        )}

        {/* Section 5: Completed */}
        {completedList.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-500 uppercase tracking-wide">
                Completed ({completedList.length})
              </h3>
            </div>
            <div className="space-y-2.5">{completedList.map(renderDeadlineCard)}</div>
          </div>
        )}
      </div>

      {/* Add / Edit Deadline Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingDeadline ? 'Edit Deadline' : 'Create New College Deadline'}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Deep Learning Project Report"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Deadline['category'])}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Exam">Exam</option>
                    <option value="Project">Project</option>
                    <option value="Placement">Placement</option>
                    <option value="Competition">Competition</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Deadline['priority'])}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Time</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Submission instructions, portal URL, guidelines..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  {editingDeadline ? 'Save Changes' : 'Create Deadline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
