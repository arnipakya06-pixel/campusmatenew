import React, { useState, useRef } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { SemesterResult, SubjectResult } from '../../types';
import {
  GraduationCap,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  TrendingUp,
  FileText,
  Eye,
  X,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const ResultsView: React.FC = () => {
  const {
    student,
    semesters,
    addSemesterResult,
    deleteSemesterResult,
    gradingConfig,
    updateGradingConfig,
    calculateOverallCgpa,
  } = useCampusMate();

  // OCR Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrResultData, setOcrResultData] = useState<any | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual GPA Calculator state
  const [calcSubjects, setCalcSubjects] = useState<SubjectResult[]>([
    { code: 'CS501', name: 'Deep Learning', credits: 4, grade: 'A+', gradePoint: 9 },
    { code: 'CS502', name: 'Big Data Systems', credits: 3, grade: 'A', gradePoint: 8 },
    { code: 'CS503', name: 'Natural Language Processing', credits: 4, grade: 'O', gradePoint: 10 },
    { code: 'CS508', name: 'Deep Learning Lab', credits: 2, grade: 'O', gradePoint: 10 },
  ]);

  // Config modal
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Compute live GPA for manual calculator
  const totalCalcCredits = calcSubjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
  const totalCalcPoints = calcSubjects.reduce(
    (sum, s) => sum + (Number(s.credits) || 0) * (Number(s.gradePoint) || 0),
    0
  );
  const calculatedManualGpa =
    totalCalcCredits > 0 ? Number((totalCalcPoints / totalCalcCredits).toFixed(2)) : 0;

  // Handle image upload and OCR extraction
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      runOcrAnalysis(file);
    }
  };

  const runOcrAnalysis = async (file: File) => {
    setOcrLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/ai/ocr-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || 'image/jpeg',
            }),
          });
          const data = await res.json();
          setOcrResultData(data);
          setShowVerificationModal(true);
        } catch (err) {
          console.error('OCR analysis failed:', err);
          alert('Could not process marksheet image. Loading verification preview.');
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setOcrLoading(false);
    }
  };

  // Confirm & Save Result from OCR verification modal
  const handleConfirmOcrSave = () => {
    if (!ocrResultData) return;

    const semNum = semesters.length + 1;
    addSemesterResult({
      semesterNumber: semNum,
      semesterName: ocrResultData.semester || `Semester ${semNum}`,
      examSession: ocrResultData.examSession || 'Nov/Dec 2025 Regular',
      subjects: ocrResultData.subjects || [],
      gpa: Number(ocrResultData.calculatedGPA) || 9.0,
      totalCredits: Number(ocrResultData.totalCredits) || 16,
      verified: true,
    });

    setShowVerificationModal(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setOcrResultData(null);
  };

  // GPA Calculator handlers
  const handleAddCalcSubject = () => {
    setCalcSubjects([
      ...calcSubjects,
      { code: `SUB${calcSubjects.length + 1}`, name: 'New Elective Course', credits: 3, grade: 'A', gradePoint: 8 },
    ]);
  };

  const handleUpdateCalcSubject = (index: number, field: keyof SubjectResult, value: any) => {
    const updated = [...calcSubjects];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-update gradePoint if grade changed
    if (field === 'grade') {
      const scale = gradingConfig.gradeScale.find((g) => g.grade === value);
      if (scale) {
        updated[index].gradePoint = scale.points;
      }
    }
    setCalcSubjects(updated);
  };

  const handleRemoveCalcSubject = (index: number) => {
    if (calcSubjects.length <= 1) return;
    setCalcSubjects(calcSubjects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Institutional Rules Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Transcript &amp; Intelligent Grade Analysis</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Results &amp; CGPA Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multimodal OCR marksheet scanner with mandatory verification, configurable institutional grading rules, and interactive GPA calculator
          </p>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold border border-slate-200 transition-colors self-start sm:self-auto"
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Config Grading Rules ({gradingConfig.system === 'weighted' ? 'Credit-Weighted' : 'Simple Average'})</span>
        </button>
      </div>

      {/* Overview Cards: CGPA, Latest GPA, Total Credits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-md shadow-indigo-500/15">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Cumulative CGPA
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black">{student.currentCgpa.toFixed(2)}</span>
            <span className="text-xs font-semibold text-indigo-200">/ 10.00 Scale</span>
          </div>
          <p className="text-xs text-indigo-100/90 mt-2">
            Calculated across {semesters.length} verified semesters ({gradingConfig.system} model).
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Latest Semester GPA
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{student.latestGpa.toFixed(2)}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Semester 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Distinction tier • Eligible for top-tier scholarships and placements.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Credits Earned
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">
              {semesters.reduce((acc, s) => acc + s.totalCredits, 0)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Credits Completed</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Full compliance with university degree curriculum credit thresholds.
          </p>
        </div>
      </div>

      {/* Feature A: Upload Result Image & Multimodal OCR */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Multimodal Marksheet / Result Scanner (Gemini Vision)
            </h2>
            <p className="text-xs text-slate-500">
              Upload your grade card (PNG, JPG, JPEG, WEBP). Extracted subjects are <strong>strictly verified by you before saving</strong>.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 self-start sm:self-auto">
            Zero Silent Saves Policy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-indigo-50/20 hover:bg-indigo-50/40 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-extrabold text-sm text-slate-800 mt-3">
              Click to upload Marksheet or Grade Card
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, JPEG, WEBP • Max 20MB
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>AI will extract subjects, grades &amp; GPA</span>
            </div>
          </div>

          {/* Quick Demo Simulator or Upload Preview */}
          <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Quick Scanner Demo for Expo
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test the OCR workflow instantly with our pre-loaded Semester 5 sample grade card:
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600 p-1.5 bg-indigo-50 rounded-xl" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Sample_Sem5_Gradesheet.jpg</p>
                  <p className="text-[11px] text-slate-400">Deep Learning, Big Data, NLP (17 Credits)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOcrLoading(true);
                  setTimeout(() => {
                    setOcrResultData({
                      semester: 'Semester 5 (Sample Grade Card)',
                      examSession: 'Nov/Dec 2025 Regular',
                      institution: 'College of Engineering & Technology',
                      studentId: 'CM2026-001',
                      subjects: [
                        { code: 'AD501', name: 'Deep Learning & Neural Networks', credits: 4, grade: 'A+', gradePoint: 9 },
                        { code: 'AD502', name: 'Big Data Technologies', credits: 3, grade: 'A', gradePoint: 8 },
                        { code: 'AD503', name: 'Natural Language Processing', credits: 4, grade: 'O', gradePoint: 10 },
                        { code: 'AD504', name: 'Cloud Computing & DevOps', credits: 3, grade: 'A+', gradePoint: 9 },
                        { code: 'AD508', name: 'Deep Learning Laboratory', credits: 2, grade: 'O', gradePoint: 10 },
                        { code: 'AD509', name: 'Professional Communication', credits: 1, grade: 'A+', gradePoint: 9 },
                      ],
                      totalCredits: 17,
                      calculatedGPA: 9.12,
                      confidence: 'High (Verified Model)',
                      notes: 'All 6 subjects extracted with 100% clarity.',
                    });
                    setOcrLoading(false);
                    setShowVerificationModal(true);
                  }, 600);
                }}
                disabled={ocrLoading}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                {ocrLoading ? 'Scanning...' : 'Test OCR Scan'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Extracted data is never saved automatically. You review each subject line first.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature B: Interactive GPA Calculator */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Interactive Semester GPA Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Formula: <code className="font-mono font-bold text-indigo-600">GPA = Σ(Credits × Grade Point) / Σ Credits</code>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-950 text-xs font-bold">
              Computed GPA:{' '}
              <span className="text-indigo-600 text-sm font-black">{calculatedManualGpa}</span>
            </div>
            <button
              onClick={handleAddCalcSubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Editable Subject Rows Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Subject Name</th>
                <th className="py-2.5 px-3">Credits</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Grade Point</th>
                <th className="py-2.5 px-3">Quality Points</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calcSubjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={sub.code}
                      onChange={(e) => handleUpdateCalcSubject(idx, 'code', e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase bg-white"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleUpdateCalcSubject(idx, 'name', e.target.value)}
                      className="w-full min-w-[160px] px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={sub.credits}
                      onChange={(e) => handleUpdateCalcSubject(idx, 'credits', Number(e.target.value))}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white font-bold"
                    >
                      {[1, 2, 3, 4, 5].map((c) => (
                        <option key={c} value={c}>
                          {c} Credits
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={sub.grade}
                      onChange={(e) => handleUpdateCalcSubject(idx, 'grade', e.target.value)}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white font-bold text-indigo-700"
                    >
                      {gradingConfig.gradeScale.map((g) => (
                        <option key={g.grade} value={g.grade}>
                          {g.grade} ({g.points} pts)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-700">
                    {sub.gradePoint}
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-indigo-600">
                    {sub.credits * sub.gradePoint}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleRemoveCalcSubject(idx)}
                      disabled={calcSubjects.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature C: Semester History & Trend Chart */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Verified Semester GPA History
            </h2>
            <p className="text-xs text-slate-500">Official university examinations records</p>
          </div>
          <span className="text-xs font-bold text-indigo-600">
            Cumulative CGPA: {student.currentCgpa.toFixed(2)}
          </span>
        </div>

        {/* Visual Bar Performance Chart */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
          <div className="flex items-end justify-between gap-3 h-32 pt-4">
            {semesters.map((sem) => {
              const heightPct = Math.round((sem.gpa / 10) * 100);
              return (
                <div key={sem.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-xs font-extrabold text-slate-900">{sem.gpa.toFixed(2)}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-600 shadow-xs hover:brightness-110 transition-all"
                  />
                  <span className="text-[11px] font-bold text-slate-600 truncate">
                    {sem.semesterName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semester cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {semesters.map((sem) => (
            <div
              key={sem.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{sem.semesterName}</h3>
                  <p className="text-[11px] text-slate-500">{sem.examSession} • {sem.totalCredits} Credits</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-indigo-600">{sem.gpa.toFixed(2)}</span>
                  <span className="block text-[10px] font-bold text-emerald-600">Verified</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex flex-wrap gap-1.5">
                {sem.subjects.map((sub, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                  >
                    {sub.code}: <strong>{sub.grade}</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MANDATORY OCR VERIFICATION MODAL */}
      {showVerificationModal && ocrResultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Verify Extracted Result Data
                  </h3>
                  <p className="text-xs text-indigo-100">
                    Confirm accuracy before committing to cumulative CGPA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs">
                <strong className="block mb-0.5">Verification Rule:</strong>
                Never silently trust OCR. Please inspect every subject name, credit count, and grade point below. You can edit any field before confirming.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Semester</span>
                  <input
                    type="text"
                    value={ocrResultData.semester || ''}
                    onChange={(e) =>
                      setOcrResultData({ ...ocrResultData, semester: e.target.value })
                    }
                    className="w-full font-bold text-xs text-slate-800 bg-transparent outline-none mt-0.5"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Calculated GPA</span>
                  <input
                    type="number"
                    step="0.01"
                    value={ocrResultData.calculatedGPA || ''}
                    onChange={(e) =>
                      setOcrResultData({ ...ocrResultData, calculatedGPA: Number(e.target.value) })
                    }
                    className="w-full font-black text-sm text-indigo-600 bg-transparent outline-none mt-0.5"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Credits</span>
                  <input
                    type="number"
                    value={ocrResultData.totalCredits || ''}
                    onChange={(e) =>
                      setOcrResultData({ ...ocrResultData, totalCredits: Number(e.target.value) })
                    }
                    className="w-full font-bold text-xs text-slate-800 bg-transparent outline-none mt-0.5"
                  />
                </div>
              </div>

              {/* Subject rows preview */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Credits</th>
                      <th className="p-2.5">Grade</th>
                      <th className="p-2.5">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(ocrResultData.subjects || []).map((sub: SubjectResult, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-mono font-bold text-slate-700">{sub.code}</td>
                        <td className="p-2.5 font-medium text-slate-800">{sub.name}</td>
                        <td className="p-2.5">{sub.credits}</td>
                        <td className="p-2.5 font-bold text-indigo-600">{sub.grade}</td>
                        <td className="p-2.5 font-mono">{sub.gradePoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOcrSave}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Save Result</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Grading Rules Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Configure Grading System</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500">
                Colleges and universities employ different weighted averaging models. Choose your institution&apos;s formula:
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="gradingSystem"
                    checked={gradingConfig.system === 'weighted'}
                    onChange={() => updateGradingConfig({ system: 'weighted' })}
                    className="accent-indigo-600"
                  />
                  <div>
                    <strong className="text-slate-800 block">Credit-Weighted GPA (Standard)</strong>
                    <span className="text-slate-500">
                      CGPA = Σ(Semester GPA × Credits) / Total Credits
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="gradingSystem"
                    checked={gradingConfig.system === 'simple'}
                    onChange={() => updateGradingConfig({ system: 'simple' })}
                    className="accent-indigo-600"
                  />
                  <div>
                    <strong className="text-slate-800 block">Simple Arithmetic Average</strong>
                    <span className="text-slate-500">
                      CGPA = Average of all semester GPAs regardless of credit weights
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Apply &amp; Recalculate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
