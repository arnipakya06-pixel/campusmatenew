export type TabType =
  | 'dashboard'
  | 'ai-assistant'
  | 'attendance'
  | 'results'
  | 'scholarships'
  | 'academics'
  | 'deadlines'
  | 'notices'
  | 'career'
  | 'achievements'
  | 'resume'
  | 'documents'
  | 'campus-map'
  | 'emergency'
  | 'profile';

export interface StudentProfile {
  name: string;
  studentId: string;
  department: string;
  year: string;
  section: string;
  currentCgpa: number;
  latestGpa: number;
  email: string;
  phone: string;
  avatarUrl: string;
  careerGoal: string;
  skills: { name: string; level: number }[];
  bio: string;
  address: string;
  bloodGroup: string;
  mentor: string;
}

export interface AttendanceRecord {
  presentDays: number;
  workingDays: number;
  requiredPercentage: number;
  lastUpdated: string;
  history: { date: string; status: 'present' | 'absent' | 'holiday'; dayName: string }[];
}

export interface SubjectResult {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterResult {
  id: string;
  semesterNumber: number;
  semesterName: string;
  examSession: string;
  subjects: SubjectResult[];
  gpa: number;
  totalCredits: number;
  verified: boolean;
  dateAdded: string;
}

export interface GradingConfig {
  system: 'weighted' | 'simple';
  maxGpa: number;
  gradeScale: { grade: string; points: number; description: string }[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  category: 'Academic' | 'Government' | 'Private' | 'Department';
  amount: string;
  deadline: string;
  eligibility: string;
  minCgpa?: number;
  departmentRequirement?: string;
  requiredDocuments: string[];
  description: string;
  status: 'Not Applied' | 'In Progress' | 'Submitted';
  isDemo: boolean;
  applicationLink?: string;
}

export interface Deadline {
  id: string;
  title: string;
  category:
    | 'Assignment'
    | 'Scholarship'
    | 'Exam'
    | 'Project'
    | 'Placement'
    | 'Competition'
    | 'Event';
  date: string; // YYYY-MM-DD
  time: string; // e.g. "17:00"
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  relatedId?: string;
  snoozedUntil?: string;
}

export interface TimetableClass {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Training';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  status: 'Pending' | 'In Progress' | 'Submitted' | 'Late';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  maxMarks: number;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Exam' | 'Campus' | 'Placement';
  date: string;
  description: string;
  urgent: boolean;
  author: string;
}

export interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  packageLPA: string;
  driveDate: string;
  eligibilityCgpa: number;
  requiredSkills: string[];
  location: string;
  status: 'Open' | 'Applied' | 'Shortlisted';
  description: string;
}

export interface SkillQuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Certification' | 'Internship' | 'Competition' | 'Hackathon' | 'Project' | 'Award';
  organization: string;
  date: string;
  description: string;
  verified: boolean;
  credentialUrl?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Academic' | 'Scholarship' | 'Career' | 'Personal';
  uploadDate: string;
  fileSize: string;
  fileType: string;
  isResult?: boolean;
  url?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Admin' | 'Facility' | 'Hostel' | 'Sports';
  coordinates: { x: number; y: number }; // percentage on map
  floor: string;
  timings: string;
  contact: string;
  description: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'attendance' | 'deadline' | 'scholarship' | 'academic' | 'placement' | 'emergency';
  targetTab?: TabType;
}

export interface StudyPlan {
  title: string;
  examDate: string;
  dailyHours: number;
  summary: string;
  days: {
    day: string;
    focus: string;
    type: string;
    hours: number;
    tasks: string[];
  }[];
  prioritySubjects: string[];
  recommendations: string[];
}
