import React, { useState } from 'react';
import { CampusMateProvider, useCampusMate } from './context/CampusMateContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExpoBanner } from './components/common/ExpoBanner';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PageNavHeader } from './components/common/PageNavHeader';

// Views
import { DashboardView } from './components/views/DashboardView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { AttendanceView } from './components/views/AttendanceView';
import { ResultsView } from './components/views/ResultsView';
import { ScholarshipsView } from './components/views/ScholarshipsView';
import { AcademicsView } from './components/views/AcademicsView';
import { DeadlinesView } from './components/views/DeadlinesView';
import { NoticesView } from './components/views/NoticesView';
import { CareerPlacementsView } from './components/views/CareerPlacementsView';
import { AchievementsView } from './components/views/AchievementsView';
import { ResumeBuilderView } from './components/views/ResumeBuilderView';
import { DocumentsView } from './components/views/DocumentsView';
import { CampusMapView } from './components/views/CampusMapView';
import { EmergencyView } from './components/views/EmergencyView';
import { ProfileView } from './components/views/ProfileView';

// Mobile Bottom Nav Icons
import {
  LayoutDashboard,
  Sparkles,
  UserCheck,
  CalendarClock,
  Menu,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, presentationMode } = useCampusMate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'attendance':
        return <AttendanceView />;
      case 'results':
        return <ResultsView />;
      case 'scholarships':
        return <ScholarshipsView />;
      case 'academics':
        return <AcademicsView />;
      case 'deadlines':
        return <DeadlinesView />;
      case 'notices':
        return <NoticesView />;
      case 'career':
        return <CareerPlacementsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'resume':
        return <ResumeBuilderView />;
      case 'documents':
        return <DocumentsView />;
      case 'campus-map':
        return <CampusMapView />;
      case 'emergency':
        return <EmergencyView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Presentation / Expo Banner */}
      <ExpoBanner />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          {/* Top Bar */}
          <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

          {/* View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <PageNavHeader />
            {renderActiveView()}
          </main>

          {/* Mobile Bottom Quick Bar (Shown on small screens) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-bold text-slate-500 shadow-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'dashboard' ? 'text-indigo-600' : 'hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'attendance' ? 'text-indigo-600' : 'hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>78%</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`flex flex-col items-center gap-1 p-1 px-2.5 rounded-xl bg-indigo-600 text-white shadow-xs ${
                activeTab === 'ai-assistant' ? 'ring-2 ring-indigo-300' : ''
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI</span>
            </button>

            <button
              onClick={() => setActiveTab('deadlines')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'deadlines' ? 'text-indigo-600' : 'hover:text-slate-900'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span>Deadlines</span>
            </button>

            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex flex-col items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>All Tabs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Universal Search Modal (Triggered via Ctrl/Cmd+K or Search Bar) */}
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <CampusMateProvider>
      <MainAppContent />
    </CampusMateProvider>
  );
}
