import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { SkillQuizQuestion, PlacementDrive } from '../../types';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

const QUIZ_QUESTIONS: SkillQuizQuestion[] = [
  {
    id: 1,
    category: 'Python',
    question: 'In Python, what is the time complexity of searching for a key in a standard dictionary?',
    options: ['O(1) Average', 'O(n) Linear', 'O(log n) Logarithmic', 'O(n^2) Quadratic'],
    correctIndex: 0,
    explanation: 'Python dictionaries are implemented using hash tables, giving average O(1) lookup complexity.',
  },
  {
    id: 2,
    category: 'SQL',
    question: 'Which SQL clause is used to filter rows after an aggregate function (e.g. GROUP BY)?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
    correctIndex: 1,
    explanation: 'HAVING filters aggregated records, whereas WHERE filters individual rows before grouping.',
  },
  {
    id: 3,
    category: 'Excel',
    question: 'Which modern Excel function replaces both VLOOKUP and HLOOKUP with bidirectional matching?',
    options: ['INDEX-MATCH', 'XLOOKUP', 'MATCHX', 'LOOKUP2'],
    correctIndex: 1,
    explanation: 'XLOOKUP allows lookups in any direction without requiring column index counting.',
  },
  {
    id: 4,
    category: 'Power BI',
    question: 'What is the expression formula language used for creating calculated columns and measures in Power BI?',
    options: ['M Query', 'DAX (Data Analysis Expressions)', 'R Script', 'Python Pandas'],
    correctIndex: 1,
    explanation: 'DAX is used for custom aggregations and measures; Power Query uses M.',
  },
  {
    id: 5,
    category: 'Machine Learning',
    question: 'When a model achieves 99% training accuracy but only 62% validation accuracy, it is suffering from:',
    options: ['High Bias (Underfitting)', 'High Variance (Overfitting)', 'Data Leakage', 'Class Imbalance'],
    correctIndex: 1,
    explanation: 'A large discrepancy between high training score and poor validation indicates overfitting.',
  },
];

export const CareerPlacementsView: React.FC = () => {
  const { student, placements, applyPlacement, skillScores, updateSkillScore } = useCampusMate();

  // Skill Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    setSelectedAnswers([]);
    setCurrentQIndex(0);
    setQuizCompleted(false);
    setScore(0);
    setQuizActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate score
      let correct = 0;
      QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const pct = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
      setScore(pct);
      setQuizCompleted(true);

      // Update skill scores live
      updateSkillScore('Python', Math.min(100, Math.max(70, pct)));
      updateSkillScore('SQL', Math.min(100, Math.max(65, pct + 5)));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Corporate Placement Drives &amp; Skill Benchmarking</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Career &amp; Placements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track upcoming campus recruitment drives, evaluate your skill readiness, and take targeted skill tests
          </p>
        </div>

        <button
          onClick={startQuiz}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Take 5-Question Skill Test</span>
        </button>
      </div>

      {/* Skill Readiness Dashboard */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Corporate Skill Readiness Profile
            </h2>
            <p className="text-xs text-slate-500">
              Benchmark for <strong>Data Analyst &amp; AI Engineer</strong> campus drives
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Abisha: CGPA <strong>8.29</strong> (Eligible for all Tier-1 drives)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(skillScores).map(([skill, val]) => (
            <div
              key={skill}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{skill}</span>
                <span className="font-extrabold text-indigo-600">{val}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  style={{ width: `${val}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    val >= 75 ? 'bg-emerald-500' : val >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">
                {val >= 75 ? 'Industry Ready' : val >= 60 ? 'Moderate Prep' : 'Needs Practice'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 5-Question Skill Test Card / Modal */}
      {quizActive && (
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
          {!quizCompleted ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-indigo-500 text-white">
                    Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-indigo-200 font-semibold">
                    Category: {QUIZ_QUESTIONS[currentQIndex].category}
                  </span>
                </div>
                <button
                  onClick={() => setQuizActive(false)}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  Exit Quiz
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold leading-relaxed text-white">
                {QUIZ_QUESTIONS[currentQIndex].question}
              </h3>

              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentQIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                      }`}
                    >
                      <span className="inline-block w-6 text-indigo-300 font-mono">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-indigo-300">
                  Select an answer to advance
                </span>
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-extrabold text-xs transition-all shadow-md"
                >
                  {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish & Compute Score' : 'Next Question →'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Skill Assessment Completed!
                </h3>
                <p className="text-sm text-indigo-200 mt-1">
                  Overall Score: <strong className="text-emerald-400 text-lg">{score}%</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-left text-xs max-w-lg mx-auto space-y-2">
                <p className="font-bold text-indigo-200 uppercase tracking-wider">
                  Improvement Recommendations:
                </p>
                <ul className="list-disc list-inside text-slate-200 space-y-1">
                  <li>Reinforce Power BI DAX formula syntax (Filter vs All contexts).</li>
                  <li>Review SQL GROUP BY vs HAVING clause optimization strategies.</li>
                  <li>Practice Python dictionary hash collisions in high-throughput loops.</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={startQuiz}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setQuizActive(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold transition-colors shadow-md"
                >
                  Save to Readiness Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Placement Drives */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Upcoming Campus Recruitment Drives
            </h2>
            <p className="text-xs text-slate-500">Official College Placement Cell Schedule</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {placements.length} Active Drives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {placements.map((drive) => {
            const isEligible = student.currentCgpa >= drive.eligibilityCgpa;
            const hasApplied = drive.status === 'Applied';
            return (
              <div
                key={drive.id}
                className="p-5 rounded-3xl border border-slate-200/80 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {drive.company}
                      </h3>
                      <p className="text-xs text-indigo-600 font-bold mt-0.5">{drive.role}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      {drive.packageLPA}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{drive.description}</p>

                  {/* Required skills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {drive.requiredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Cutoff: CGPA ≥ {drive.eligibilityCgpa.toFixed(1)}</span>
                      <span className="font-bold text-emerald-600">
                        {isEligible ? '✅ You Qualify' : 'Ineligible'}
                      </span>
                    </div>
                    <p className="text-slate-500">Drive Date: {drive.driveDate}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      hasApplied ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {drive.status}
                  </span>

                  <button
                    onClick={() => applyPlacement(drive.id)}
                    disabled={!isEligible || hasApplied}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      hasApplied
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : isEligible
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {hasApplied ? 'Registered' : 'Register for Drive'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
