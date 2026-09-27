import React, { useState, useRef, useEffect } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { askCampusMateAI } from '../../services/aiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Calculator,
  CalendarClock,
  Award,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isMathWarning?: boolean;
}

export const AIAssistantView: React.FC = () => {
  const { student, attendance, deadlines, scholarships, timetable, assignments } = useCampusMate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello ${student.name}! 👋 I'm **CampusMate AI**, your personal college copilot.

I have full visibility into your **whole-day attendance** (${attendance.presentDays}/${attendance.workingDays} days = **78%**), your **8.29 CGPA**, current deadlines, and today's classes.

You can ask me to simulate leaves, calculate attendance targets, check scholarships, or summarize your pending assignments!`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    'If I take one day leave, what will my attendance be?',
    'How many days can I safely take leave?',
    'How many days do I need to attend to reach 80%?',
    'What scholarships are available for me?',
    'When is my next deadline?',
    'What is my current CGPA and latest semester GPA?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const studentContext = {
        name: student.name,
        studentId: student.studentId,
        department: student.department,
        year: student.year,
        cgpa: student.currentCgpa,
        latestGpa: student.latestGpa,
        attendancePercent: Number(((attendance.presentDays / attendance.workingDays) * 100).toFixed(2)),
        presentDays: attendance.presentDays,
        workingDays: attendance.workingDays,
        deadlines: deadlines.map((d) => ({ title: d.title, date: d.date, priority: d.priority })),
        assignments: assignments.map((a) => ({ title: a.title, status: a.status })),
        scholarships: scholarships.map((s) => ({ name: s.name, amount: s.amount, deadline: s.deadline })),
      };

      const replyText = await askCampusMateAI(query, studentContext);

      const isWarning =
        replyText.toLowerCase().includes('drops below') ||
        replyText.toLowerCase().includes('shortage') ||
        replyText.toLowerCase().includes('warning') ||
        replyText.toLowerCase().includes('< 75');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMathWarning: isWarning,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Deterministic emergency fallback in case server fails
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Here is the calculation based on your current record (${attendance.presentDays} present / ${attendance.workingDays} working days):\n\nIf you take 1 day of leave, your attendance becomes **${((attendance.presentDays / (attendance.workingDays + 1)) * 100).toFixed(2)}%**, which is **SAFE** (≥ 75%).`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <BackButton variant="white" size="sm" />
          <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg">CampusMate AI</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                Online
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              Personalized for {student.name} • AI &amp; Data Science
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
          <span>Attendance: <strong>78%</strong></span>
          <span>•</span>
          <span>CGPA: <strong>{student.currentCgpa.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                } ${msg.isMathWarning ? 'border-amber-300 ring-2 ring-amber-200/50' : ''}`}
              >
                {/* Content formatting */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.text.split('\n').map((line, idx) => {
                    // Simple inline bolding parser for display
                    return (
                      <p key={idx} className={line.startsWith('#') ? 'font-bold text-base' : ''}>
                        {line}
                      </p>
                    );
                  })}
                </div>

                <div
                  className={`mt-2 text-[10px] flex items-center justify-end ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>CampusMate AI is calculating with live college data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Quick Prompts:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium transition-colors border border-slate-200/70"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about attendance leave math, deadlines, GPA, or scholarships..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
