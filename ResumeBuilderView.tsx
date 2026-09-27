import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import {
  FileBadge,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Award,
  Briefcase,
  Code2,
} from 'lucide-react';

export const ResumeBuilderView: React.FC = () => {
  const { student, semesters, achievements } = useCampusMate();
  const [template, setTemplate] = useState<'modern' | 'classic'>('modern');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
              <FileBadge className="w-3.5 h-3.5 text-indigo-600" />
              <span>Automated Profile-Synced Resume Compiler</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live ATS-ready resume compiled from your verified college profile, CGPA (8.29), and achievements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'modern' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Modern ATS
            </button>
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'classic' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Academic
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Live Resume Sheet (Styled like a clean 8.5x11 / A4 document) */}
      <div className="bg-white max-w-4xl mx-auto rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-12 text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        {/* Header Block */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 uppercase font-sans">
              {student.name}
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
              {student.department} • 3rd Year
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{student.bio}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              {student.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              {student.phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              {student.address}
            </span>
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Education &amp; Academic Honors
          </h3>
          <div className="flex justify-between items-start text-xs sm:text-sm">
            <div>
              <p className="font-extrabold text-slate-900">
                Bachelor of Technology in Artificial Intelligence &amp; Data Science
              </p>
              <p className="text-slate-600 text-xs">
                Campus Institute of Technology &amp; Engineering • Affiliated to Anna University
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Expected Graduation: May 2027 • Section A • Student ID: {student.studentId}
              </p>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-indigo-700 text-sm block">
                Cumulative CGPA: {student.currentCgpa.toFixed(2)} / 10.00
              </span>
              <span className="text-[11px] text-slate-500">
                Latest Sem 4 GPA: {student.latestGpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Skills Section */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-600" />
            Core Technical Competencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <strong className="text-slate-900">Programming Languages:</strong> Python, C++, SQL, R
            </div>
            <div>
              <strong className="text-slate-900">Data Analytics &amp; BI:</strong> Advanced Excel, Power BI, Pandas, NumPy
            </div>
            <div>
              <strong className="text-slate-900">Machine Learning &amp; AI:</strong> PyTorch, Scikit-Learn, CNNs, NLP, OpenCV
            </div>
            <div>
              <strong className="text-slate-900">Cloud &amp; DevOps:</strong> AWS (EC2, S3), Git/GitHub, Docker, Linux
            </div>
          </div>
        </div>

        {/* Professional Experience & Internships */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Internships &amp; Practical Experience
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>Data Analytics &amp; Python Intern • Data Insights Inc</span>
                <span className="text-slate-500 font-normal">June 2025 – July 2025 (8 Weeks)</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 mt-1 leading-relaxed">
                <li>Automated daily ETL extraction pipelines using Python scripts, slashing report generation turnaround by 45%.</li>
                <li>Created 12 multi-dimensional interactive dashboards in Power BI for transaction stream KPI monitoring.</li>
                <li>Collaborated with senior data architects to fine-tune PostgreSQL indexes and complex relational joins.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Academic & Hackathon Projects */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Selected Technical Projects
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>Smart Crop Disease Detector (Smart India Hackathon Finalist)</span>
                <span className="text-slate-500 font-normal">2025</span>
              </div>
              <p className="text-slate-600 leading-relaxed mt-0.5">
                Engineered a lightweight Convolutional Neural Network deployed on edge devices to diagnose foliar plant diseases from drone footage with 94.2% test accuracy.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>CampusMate: Smart College Companion Architecture</span>
                <span className="text-slate-500 font-normal">2026</span>
              </div>
              <p className="text-slate-600 leading-relaxed mt-0.5">
                Full-stack student assistant integrating Gemini multimodal vision for marksheet verification, whole-day attendance leave simulation algorithms, and synchronized academic planning.
              </p>
            </div>
          </div>
        </div>

        {/* Certifications & Achievements */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            Verified Honors &amp; Certifications
          </h3>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
            {achievements.map((ach) => (
              <li key={ach.id}>
                <strong className="text-slate-900">{ach.title}</strong> — {ach.organization} ({ach.date})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
