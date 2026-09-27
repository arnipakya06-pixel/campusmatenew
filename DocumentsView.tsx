import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { DocumentItem } from '../../types';
import {
  FolderLock,
  Upload,
  FileText,
  Trash2,
  Eye,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  X,
  FileCheck,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, deleteDocument, setActiveTab } = useCampusMate();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Upload Form states
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('Academic');
  const [isResult, setIsResult] = useState(false);

  const categories = ['All', 'Academic', 'Scholarship', 'Career', 'Personal'];

  const filteredDocs = documents.filter((doc) => {
    if (activeCategory === 'All') return true;
    return doc.category === activeCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    addDocument({
      name: docName,
      category: docCategory,
      fileSize: '1.2 MB',
      fileType: 'PDF Document',
      isResult,
    });

    setUploadModalOpen(false);
    setDocName('');
    setIsResult(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
              <FolderLock className="w-3.5 h-3.5 text-blue-600" />
              <span>Secure Student Document Locker</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload, preview, and categorize official college certificates, marksheets, bonafides, and IDs
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {doc.category}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  {doc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {doc.fileType} • {doc.fileSize} • Uploaded {doc.uploadDate}
                </p>
              </div>

              {doc.isResult && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                  <span className="font-medium">Marksheet Document</span>
                  <button
                    onClick={() => setActiveTab('results')}
                    className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Run OCR</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => deleteDocument(doc.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Upload Document</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Semester 5 Provisional Grade Card"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as DocumentItem['category'])}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold"
                >
                  <option value="Academic">Academic (Marksheet, Bonafide)</option>
                  <option value="Scholarship">Scholarship (Income / First Graduate)</option>
                  <option value="Career">Career (Internship, Certificate)</option>
                  <option value="Personal">Personal (ID Card, Passbook)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isResultCheck"
                  checked={isResult}
                  onChange={(e) => setIsResult(e.target.checked)}
                  className="accent-indigo-600"
                />
                <label htmlFor="isResultCheck" className="text-slate-700 font-semibold cursor-pointer">
                  This document contains grades / marksheet (link to OCR scanner)
                </label>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400">
                <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                <span className="text-xs">Drag &amp; drop file or select from disk</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Drawer/Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">{previewDoc.name}</h3>
                <p className="text-xs text-indigo-100">
                  {previewDoc.category} • {previewDoc.fileSize}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center space-y-4 bg-slate-50">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center shadow-xs">
                <FileCheck className="w-10 h-10" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base">{previewDoc.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Official college verified cryptographic document on secure storage.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Digitally Signed by College Registrar</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Document ID: {previewDoc.id}</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
