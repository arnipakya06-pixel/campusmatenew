import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  Download,
  RotateCcw,
  Edit3,
  Check,
  Shield,
  Heart,
  Briefcase,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { student, updateStudent, attendance, semesters, resetDemoData } = useCampusMate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [careerGoal, setCareerGoal] = useState(student.careerGoal);
  const [bio, setBio] = useState(student.bio);
  const [address, setAddress] = useState(student.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name,
      email,
      phone,
      careerGoal,
      bio,
      address,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          student,
          attendance,
          semesters,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CampusMate_${student.studentId}_Profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Student Identity &amp; Digital Dossier</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personal records, university enrollment credentials, and platform privacy settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved and synchronized across CampusMate!</span>
        </div>
      )}

      {/* Main Profile Identity Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            <span className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{student.name}</h2>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {student.studentId}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Department of {student.department} • {student.year}, Section {student.section}
            </p>
            <p className="text-xs text-slate-500">{student.bio}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                CGPA: {student.currentCgpa.toFixed(2)}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                Attendance: 78% (Safe)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                Blood Group: {student.bloodGroup}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information or Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                Contact &amp; Campus Details
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{student.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                Academic Mentorship &amp; Aspirations
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Faculty Mentor:</strong>
                    <span className="text-slate-500 text-xs">{student.mentor}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">Career Goal:</strong>
                    <span className="text-slate-500 text-xs">{student.careerGoal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Career Goal</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Campus Hostel / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Data Management & Expo Reset */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Data Sovereignty &amp; Prototype Controls
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-xs font-bold text-slate-800">Export Student Academic Dossier</p>
            <p className="text-[11px] text-slate-500">
              Download your complete verified records as an offline JSON archive.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Backup (.JSON)</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-rose-700">Reset Demo State for Expo Presentation</p>
            <p className="text-[11px] text-slate-500">
              Clears browser local storage modifications and restores default Abisha (CM2026-001) values.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all demo data back to default Abisha values?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
