import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { Achievement } from '../../types';
import {
  Trophy,
  Plus,
  Award,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Briefcase,
  Code2,
  X,
  Filter,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements, addAchievement, deleteAchievement } = useCampusMate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Achievement['category']>('Certification');
  const [organization, setOrganization] = useState('');
  const [date, setDate] = useState('2025-08-01');
  const [description, setDescription] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const categories = [
    'All',
    'Certification',
    'Internship',
    'Hackathon',
    'Competition',
    'Project',
    'Award',
  ];

  const filteredList = achievements.filter((a) => {
    if (filterCategory === 'All') return true;
    return a.category === filterCategory;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization) return;

    addAchievement({
      title,
      category,
      organization,
      date,
      description,
      verified: true,
      credentialUrl: credentialUrl || undefined,
    });

    setAddModalOpen(false);
    setTitle('');
    setOrganization('');
    setDescription('');
    setCredentialUrl('');
  };

  const getCategoryIcon = (cat: Achievement['category']) => {
    switch (cat) {
      case 'Certification':
        return <Award className="w-5 h-5 text-indigo-600" />;
      case 'Internship':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Hackathon':
        return <Code2 className="w-5 h-5 text-purple-600" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>Digital Credential Wallet &amp; Verified Honors</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Achievement Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store and showcase verified certifications, hackathons, internships, and academic honors
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Filter Category Tabs */}
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

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((ach) => (
          <div
            key={ach.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100">
                  {getCategoryIcon(ach.category)}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  {ach.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">{ach.title}</h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{ach.organization}</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{ach.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{ach.date}</span>

              <div className="flex items-center gap-2">
                {ach.credentialUrl && (
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded flex items-center gap-1 font-semibold"
                    title="View Credential URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View</span>
                  </a>
                )}

                <button
                  onClick={() => deleteAchievement(ach.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  title="Delete achievement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Achievement Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Achievement</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Achievement['category'])}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="Certification">Certification</option>
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Project">Project</option>
                    <option value="Award">Award</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. IIT Madras / NPTEL"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Honors</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ranking, score, project details..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Credential Link (Optional)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
