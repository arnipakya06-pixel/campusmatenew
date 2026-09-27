import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { Notice } from '../../types';
import {
  Bell,
  AlertTriangle,
  Calendar,
  User,
  Plus,
  Filter,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices, addNotice } = useCampusMate();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [addNoticeModalOpen, setAddNoticeModalOpen] = useState(false);

  // Form states
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Notice['category']>('Academic');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [noticeUrgent, setNoticeUrgent] = useState(false);
  const [noticeAuthor, setNoticeAuthor] = useState('Office of the Dean');

  const categories = ['All', 'Academic', 'Exam', 'Campus', 'Placement'];

  const filteredNotices = notices.filter((n) => {
    if (filterCategory === 'All') return true;
    return n.category === filterCategory;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeDescription) return;

    addNotice({
      title: noticeTitle,
      category: noticeCategory,
      date: new Date().toISOString().split('T')[0],
      description: noticeDescription,
      urgent: noticeUrgent,
      author: noticeAuthor,
    });

    setAddNoticeModalOpen(false);
    setNoticeTitle('');
    setNoticeDescription('');
    setNoticeUrgent(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60">
              <Bell className="w-3.5 h-3.5 text-purple-600" />
              <span>Official University Circulars &amp; Campus Bulletin</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notices &amp; Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay up to date with semester circulars, placement notifications, and campus events
          </p>
        </div>

        <button
          onClick={() => setAddNoticeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Post College Notice</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`p-6 rounded-3xl border transition-all ${
              n.urgent
                ? 'bg-white border-amber-300 ring-2 ring-amber-100 shadow-sm'
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {n.category} Circular
                  </span>

                  {n.urgent && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Priority Circular
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                  {n.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {n.description}
                </p>
              </div>

              <div className="text-xs text-slate-400 sm:text-right flex-shrink-0">
                <span className="flex items-center gap-1 sm:justify-end text-slate-600 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {n.date}
                </span>
                <span className="flex items-center gap-1 sm:justify-end text-[11px] text-slate-400 mt-1">
                  <User className="w-3 h-3" />
                  {n.author}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {addNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Post College Notice</h3>
              <button
                onClick={() => setAddNoticeModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Term Practical Exams"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as Notice['category'])}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Campus">Campus</option>
                    <option value="Placement">Placement</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={noticeAuthor}
                    onChange={(e) => setNoticeAuthor(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={noticeDescription}
                  onChange={(e) => setNoticeDescription(e.target.value)}
                  placeholder="Complete circular text..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={noticeUrgent}
                  onChange={(e) => setNoticeUrgent(e.target.checked)}
                  className="accent-amber-600"
                />
                <label htmlFor="urgentCheck" className="text-amber-950 font-semibold cursor-pointer">
                  Mark as Urgent Circular (Highlights with alert badge)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddNoticeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
