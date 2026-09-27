import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  StudentProfile,
  AttendanceRecord,
  SemesterResult,
  GradingConfig,
  Scholarship,
  Deadline,
  TimetableClass,
  Assignment,
  Notice,
  PlacementDrive,
  Achievement,
  DocumentItem,
  CampusLocation,
  AppNotification,
  StudyPlan,
} from '../types';

interface CampusMateContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  history: TabType[];
  goBack: () => void;
  canGoBack: boolean;
  previousTab: TabType | null;
  student: StudentProfile;
  updateStudent: (updates: Partial<StudentProfile>) => void;
  attendance: AttendanceRecord;
  updateAttendance: (presentDays: number, workingDays: number) => void;
  markTodayAttendance: (status: 'present' | 'absent') => void;
  semesters: SemesterResult[];
  addSemesterResult: (newSem: Omit<SemesterResult, 'id' | 'dateAdded'>) => void;
  deleteSemesterResult: (id: string) => void;
  gradingConfig: GradingConfig;
  updateGradingConfig: (newConfig: Partial<GradingConfig>) => void;
  calculateOverallCgpa: (resultsList?: SemesterResult[]) => number;
  scholarships: Scholarship[];
  updateScholarshipStatus: (id: string, status: Scholarship['status']) => void;
  deadlines: Deadline[];
  addDeadline: (deadline: Omit<Deadline, 'id' | 'completed'>) => void;
  updateDeadline: (id: string, updates: Partial<Deadline>) => void;
  toggleDeadline: (id: string) => void;
  snoozeDeadline: (id: string, days: number) => void;
  deleteDeadline: (id: string) => void;
  timetable: TimetableClass[];
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  placements: PlacementDrive[];
  applyPlacement: (id: string) => void;
  skillScores: Record<string, number>;
  updateSkillScore: (skill: string, score: number) => void;
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: string) => void;
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;
  campusLocations: CampusLocation[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan | null) => void;
  presentationMode: boolean;
  togglePresentationMode: () => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'campusmate_student_data_v2';

const DEFAULT_STUDENT: StudentProfile = {
  name: 'Abisha',
  studentId: 'CM2026-001',
  department: 'AI & Data Science',
  year: '3rd Year',
  section: 'A',
  currentCgpa: 8.29,
  latestGpa: 8.45,
  email: 'abisha.cm@campus.edu',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  careerGoal: 'AI Research Scientist & Machine Learning Engineer',
  skills: [
    { name: 'Python', level: 80 },
    { name: 'Excel & Analytics', level: 80 },
    { name: 'SQL & DBMS', level: 60 },
    { name: 'Power BI', level: 50 },
    { name: 'Machine Learning', level: 75 },
  ],
  bio: 'Third-year Artificial Intelligence & Data Science undergraduate passionate about deep learning, predictive models, and ethical tech solutions.',
  address: 'Room 304, Kaveri Women’s Hostel, College Campus',
  bloodGroup: 'O+',
  mentor: 'Dr. K. Ramanathan (Professor & HOD, AI & DS)',
};

const DEFAULT_ATTENDANCE: AttendanceRecord = {
  presentDays: 78,
  workingDays: 100,
  requiredPercentage: 75,
  lastUpdated: new Date().toISOString(),
  history: [
    { date: '2026-09-26', status: 'present', dayName: 'Friday' },
    { date: '2026-09-25', status: 'present', dayName: 'Thursday' },
    { date: '2026-09-24', status: 'present', dayName: 'Wednesday' },
    { date: '2026-09-23', status: 'present', dayName: 'Tuesday' },
    { date: '2026-09-22', status: 'present', dayName: 'Monday' },
    { date: '2026-09-19', status: 'absent', dayName: 'Friday' },
    { date: '2026-09-18', status: 'present', dayName: 'Thursday' },
    { date: '2026-09-17', status: 'present', dayName: 'Wednesday' },
  ],
};

const DEFAULT_SEMESTERS: SemesterResult[] = [
  {
    id: 'sem-1',
    semesterNumber: 1,
    semesterName: 'Semester 1',
    examSession: 'Nov/Dec 2023 Regular',
    gpa: 7.82,
    totalCredits: 22,
    verified: true,
    dateAdded: '2024-01-15',
    subjects: [
      { code: 'MA101', name: 'Linear Algebra & Calculus', credits: 4, grade: 'A', gradePoint: 8 },
      { code: 'PH101', name: 'Engineering Physics', credits: 3, grade: 'B+', gradePoint: 7 },
      { code: 'CS101', name: 'Problem Solving & Python', credits: 4, grade: 'A+', gradePoint: 9 },
      { code: 'EE101', name: 'Basic Electrical Engg', credits: 3, grade: 'B+', gradePoint: 7 },
      { code: 'HS101', name: 'Technical English', credits: 3, grade: 'A', gradePoint: 8 },
      { code: 'CS108', name: 'Python Programming Lab', credits: 2, grade: 'O', gradePoint: 10 },
      { code: 'PH108', name: 'Physics Laboratory', credits: 2, grade: 'A', gradePoint: 8 },
      { code: 'GE101', name: 'Engineering Practices', credits: 1, grade: 'A', gradePoint: 8 },
    ],
  },
  {
    id: 'sem-2',
    semesterNumber: 2,
    semesterName: 'Semester 2',
    examSession: 'Apr/May 2024 Regular',
    gpa: 8.10,
    totalCredits: 22,
    verified: true,
    dateAdded: '2024-07-10',
    subjects: [
      { code: 'MA201', name: 'Probability & Statistics', credits: 4, grade: 'A+', gradePoint: 9 },
      { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, grade: 'A', gradePoint: 8 },
      { code: 'AD201', name: 'Foundations of Data Science', credits: 3, grade: 'A', gradePoint: 8 },
      { code: 'EC201', name: 'Digital Electronics', credits: 3, grade: 'B+', gradePoint: 7 },
      { code: 'CS208', name: 'Data Structures Lab', credits: 2, grade: 'O', gradePoint: 10 },
      { code: 'AD208', name: 'Data Science Tools Lab', credits: 2, grade: 'A+', gradePoint: 9 },
      { code: 'HS201', name: 'Environmental Science', credits: 2, grade: 'B+', gradePoint: 7 },
      { code: 'GE201', name: 'Design Thinking', credits: 2, grade: 'A', gradePoint: 8 },
    ],
  },
  {
    id: 'sem-3',
    semesterNumber: 3,
    semesterName: 'Semester 3',
    examSession: 'Nov/Dec 2024 Regular',
    gpa: 8.29,
    totalCredits: 24,
    verified: true,
    dateAdded: '2025-01-20',
    subjects: [
      { code: 'AD301', name: 'Artificial Intelligence Concepts', credits: 4, grade: 'A+', gradePoint: 9 },
      { code: 'CS301', name: 'Database Management Systems', credits: 4, grade: 'A', gradePoint: 8 },
      { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', gradePoint: 8 },
      { code: 'CS303', name: 'Operating Systems', credits: 3, grade: 'B+', gradePoint: 7 },
      { code: 'MA301', name: 'Discrete Mathematics', credits: 4, grade: 'A', gradePoint: 8 },
      { code: 'CS308', name: 'DBMS Laboratory', credits: 2, grade: 'O', gradePoint: 10 },
      { code: 'CS309', name: 'OS & Linux Lab', credits: 2, grade: 'A+', gradePoint: 9 },
      { code: 'AD308', name: 'AI Mini Project - Phase 1', credits: 1, grade: 'O', gradePoint: 10 },
    ],
  },
  {
    id: 'sem-4',
    semesterNumber: 4,
    semesterName: 'Semester 4',
    examSession: 'Apr/May 2025 Regular',
    gpa: 8.45,
    totalCredits: 24,
    verified: true,
    dateAdded: '2025-07-15',
    subjects: [
      { code: 'AD401', name: 'Machine Learning Fundamentals', credits: 4, grade: 'O', gradePoint: 10 },
      { code: 'AD402', name: 'Data Mining & Warehousing', credits: 4, grade: 'A+', gradePoint: 9 },
      { code: 'CS401', name: 'Computer Networks', credits: 3, grade: 'A', gradePoint: 8 },
      { code: 'AD403', name: 'R Programming for Data Analytics', credits: 3, grade: 'A', gradePoint: 8 },
      { code: 'HS401', name: 'Universal Human Values', credits: 3, grade: 'A+', gradePoint: 9 },
      { code: 'AD408', name: 'Machine Learning Lab', credits: 2, grade: 'O', gradePoint: 10 },
      { code: 'CS408', name: 'Networks Simulation Lab', credits: 2, grade: 'B+', gradePoint: 7 },
      { code: 'AD409', name: 'Industry Internship Report', credits: 3, grade: 'A+', gradePoint: 9 },
    ],
  },
];

const DEFAULT_GRADING_CONFIG: GradingConfig = {
  system: 'weighted',
  maxGpa: 10,
  gradeScale: [
    { grade: 'O', points: 10, description: 'Outstanding (91-100)' },
    { grade: 'A+', points: 9, description: 'Excellent (81-90)' },
    { grade: 'A', points: 8, description: 'Very Good (71-80)' },
    { grade: 'B+', points: 7, description: 'Good (61-70)' },
    { grade: 'B', points: 6, description: 'Above Average (51-60)' },
    { grade: 'C', points: 5, description: 'Average (45-50)' },
    { grade: 'RA', points: 0, description: 'Reappear (<45)' },
  ],
};

const DEFAULT_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-1',
    name: 'Merit Scholarship',
    provider: 'State Higher Education Council',
    category: 'Academic',
    amount: '₹50,000 / year',
    deadline: '2026-10-15',
    eligibility: '75%+ academic performance (CGPA ≥ 7.50). Regular full-time students with no active backlogs.',
    minCgpa: 7.5,
    requiredDocuments: ['Semester Marksheets (Sem 1-4)', 'Bonafide Certificate', 'Bank Passbook Copy', 'College ID'],
    description: 'Awarded to top 10% academic achievers to support tuition and educational resources.',
    status: 'Not Applied',
    isDemo: true,
  },
  {
    id: 'sch-2',
    name: 'First Graduate Support',
    provider: 'Department of Welfare & Education',
    category: 'Government',
    amount: '₹25,000 / year',
    deadline: '2026-10-22',
    eligibility: 'First-generation higher education students from eligible families.',
    minCgpa: 6.0,
    requiredDocuments: ['First Graduate Certificate from Tahsildar', 'Parent Declaration', 'Community Certificate', 'Bonafide'],
    description: 'Empowers first-generation college students with tuition fee waiver and learning allowance.',
    status: 'Not Applied',
    isDemo: true,
  },
  {
    id: 'sch-3',
    name: 'Women in STEM Scholarship',
    provider: 'Global Tech Foundation for Education',
    category: 'Private',
    amount: '₹60,000 / year',
    deadline: '2026-10-30',
    eligibility: 'Eligible female engineering/STEM undergraduates maintaining CGPA ≥ 8.00.',
    minCgpa: 8.0,
    departmentRequirement: 'AI & Data Science / CSE / IT / ECE',
    requiredDocuments: ['College Marksheet', 'Resume', '500-word Statement of Purpose on AI innovation', 'Letter of Recommendation'],
    description: 'Fostering gender diversity in engineering through financial grant and 1-on-1 industry mentorship.',
    status: 'In Progress',
    isDemo: true,
  },
  {
    id: 'sch-4',
    name: 'AI & Tech Innovators Grant',
    provider: 'Campus Innovation Council',
    category: 'Department',
    amount: '₹40,000 / project',
    deadline: '2026-11-05',
    eligibility: 'Students with functional AI/Data Science hardware or software project prototypes.',
    minCgpa: 7.0,
    requiredDocuments: ['Project Abstract & Architecture PDF', 'GitHub Repository Link', 'Faculty Mentor Approval'],
    description: 'Seed funding to take innovative student prototypes to patenting or conference publication.',
    status: 'Not Applied',
    isDemo: true,
  },
];

const DEFAULT_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    title: 'DBMS Relational Calculus Assignment',
    category: 'Assignment',
    date: '2026-09-27',
    time: '17:00',
    description: 'Submit solution set for tuple relational calculus and query optimization worksheets on Campus Portal.',
    priority: 'High',
    completed: false,
    relatedId: 'asg-1',
  },
  {
    id: 'dl-2',
    title: 'Merit Scholarship Application Deadline',
    category: 'Scholarship',
    date: '2026-10-15',
    time: '23:59',
    description: 'Submit verified bonafide certificate and marksheets to scholarship portal.',
    priority: 'High',
    completed: false,
    relatedId: 'sch-1',
  },
  {
    id: 'dl-3',
    title: 'ML Mini-Project Model Evaluation',
    category: 'Project',
    date: '2026-10-18',
    time: '14:00',
    description: 'Live presentation of Convolutional Neural Network baseline weights and accuracy metrics.',
    priority: 'Medium',
    completed: false,
    relatedId: 'asg-2',
  },
  {
    id: 'dl-4',
    title: 'First Graduate Support Form Submission',
    category: 'Scholarship',
    date: '2026-10-22',
    time: '16:00',
    description: 'Hardcopy document verification at College Administrative block counter 4.',
    priority: 'Medium',
    completed: false,
    relatedId: 'sch-2',
  },
  {
    id: 'dl-5',
    title: 'Women in STEM Scholarship SOP & Resume',
    category: 'Scholarship',
    date: '2026-10-30',
    time: '23:59',
    description: 'Submit 500-word SOP and verified resume on Global Tech portal.',
    priority: 'High',
    completed: false,
    relatedId: 'sch-3',
  },
  {
    id: 'dl-6',
    title: 'Unit Test 2: Deep Learning & Cloud',
    category: 'Exam',
    date: '2026-11-02',
    time: '09:30',
    description: 'Mid-term written exam covering Units 3 & 4 of semester curriculum.',
    priority: 'High',
    completed: false,
  },
];

const DEFAULT_TIMETABLE: TimetableClass[] = [
  // Monday
  { id: 'tt-1', day: 'Monday', time: '09:00 AM - 10:45 AM', subject: 'Machine Learning', code: 'AD401', faculty: 'Dr. K. Ramanathan', room: 'Hall 302', type: 'Theory' },
  { id: 'tt-2', day: 'Monday', time: '11:15 AM - 01:00 PM', subject: 'Python Lab', code: 'AD408', faculty: 'Prof. S. Divya', room: 'Lab 4 (AI Wing)', type: 'Lab' },
  { id: 'tt-3', day: 'Monday', time: '02:00 PM - 03:45 PM', subject: 'Placement Training', code: 'TR301', faculty: 'Corporate Career Cell', room: 'Auditorium', type: 'Training' },
  // Tuesday
  { id: 'tt-4', day: 'Tuesday', time: '09:00 AM - 10:45 AM', subject: 'Cloud Computing', code: 'CS504', faculty: 'Dr. M. Arvind', room: 'Hall 302', type: 'Theory' },
  { id: 'tt-5', day: 'Tuesday', time: '11:15 AM - 01:00 PM', subject: 'Big Data Analytics', code: 'AD502', faculty: 'Dr. P. Suresh', room: 'Hall 305', type: 'Theory' },
  { id: 'tt-6', day: 'Tuesday', time: '02:00 PM - 03:45 PM', subject: 'Data Science Lab', code: 'AD508', faculty: 'Prof. S. Divya', room: 'Lab 4', type: 'Lab' },
  // Wednesday
  { id: 'tt-7', day: 'Wednesday', time: '09:00 AM - 10:45 AM', subject: 'Natural Language Processing', code: 'AD503', faculty: 'Dr. R. Kavitha', room: 'Hall 302', type: 'Theory' },
  { id: 'tt-8', day: 'Wednesday', time: '11:15 AM - 01:00 PM', subject: 'Machine Learning', code: 'AD401', faculty: 'Dr. K. Ramanathan', room: 'Hall 302', type: 'Theory' },
  { id: 'tt-9', day: 'Wednesday', time: '02:00 PM - 03:45 PM', subject: 'Technical Seminar', code: 'AD509', faculty: 'HOD & Faculty Board', room: 'Seminar Hall', type: 'Training' },
  // Thursday
  { id: 'tt-10', day: 'Thursday', time: '09:00 AM - 10:45 AM', subject: 'Big Data Technologies', code: 'AD502', faculty: 'Dr. P. Suresh', room: 'Hall 305', type: 'Theory' },
  { id: 'tt-11', day: 'Thursday', time: '11:15 AM - 01:00 PM', subject: 'Deep Learning Lab', code: 'AD508', faculty: 'Dr. K. Ramanathan', room: 'Lab 5 (GPU Cluster)', type: 'Lab' },
  { id: 'tt-12', day: 'Thursday', time: '02:00 PM - 03:45 PM', subject: 'Professional Ethics', code: 'HS501', faculty: 'Dr. A. Meenakshi', room: 'Hall 302', type: 'Theory' },
  // Friday
  { id: 'tt-13', day: 'Friday', time: '09:00 AM - 10:45 AM', subject: 'Cloud Computing Lab', code: 'CS508', faculty: 'Dr. M. Arvind', room: 'Cloud Lab 2', type: 'Lab' },
  { id: 'tt-14', day: 'Friday', time: '11:15 AM - 01:00 PM', subject: 'NLP & LLM Foundations', code: 'AD503', faculty: 'Dr. R. Kavitha', room: 'Hall 302', type: 'Theory' },
  { id: 'tt-15', day: 'Friday', time: '02:00 PM - 03:45 PM', subject: 'Aptitude & Soft Skills', code: 'TR302', faculty: 'TalentSprint Trainer', room: 'Auditorium', type: 'Training' },
  // Saturday
  { id: 'tt-16', day: 'Saturday', time: '09:00 AM - 11:00 AM', subject: 'Hackathon Project Review', code: 'PR301', faculty: 'Project Coordinators', room: 'AI Incubation Cell', type: 'Training' },
  { id: 'tt-17', day: 'Saturday', time: '11:15 AM - 01:00 PM', subject: 'Club Activities & Sports', code: 'EA101', faculty: 'Student Council', room: 'Sports Complex', type: 'Training' },
];

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'DBMS Relational Calculus & Indexing',
    subject: 'Database Management Systems',
    dueDate: '2026-09-27',
    status: 'Pending',
    priority: 'High',
    description: 'Solve query optimization questions 1 to 15 from textbook Chapter 12.',
    maxMarks: 20,
  },
  {
    id: 'asg-2',
    title: 'ML Mini-Project Model Evaluation Notebook',
    subject: 'Machine Learning',
    dueDate: '2026-10-18',
    status: 'In Progress',
    priority: 'High',
    description: 'Submit Jupyter notebook with data preprocessing, CNN training, and confusion matrix visualization.',
    maxMarks: 30,
  },
  {
    id: 'asg-3',
    title: 'Packet Tracer Multi-Router Topology',
    subject: 'Computer Networks',
    dueDate: '2026-09-20',
    status: 'Submitted',
    priority: 'Medium',
    description: 'Configured OSPF routing protocol across 4 subnets and verified packet transfer.',
    maxMarks: 25,
  },
  {
    id: 'asg-4',
    title: 'Cloud AWS Architecture Case Study',
    subject: 'Cloud Computing & DevOps',
    dueDate: '2026-10-25',
    status: 'Pending',
    priority: 'Medium',
    description: 'Draft a 4-page whitepaper proposing an auto-scaling serverless architecture for an e-commerce platform.',
    maxMarks: 25,
  },
];

const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Campus Hackathon 2026 Registration Open',
    category: 'Campus',
    date: '2026-09-26',
    description: '36-hour national college hackathon with ₹2,00,000 cash prize pool. Form teams of 3 to 4 students before Oct 10.',
    urgent: true,
    author: 'Campus Innovation Council',
  },
  {
    id: 'not-2',
    title: 'Mandatory 75% Attendance Circular for Semester Exams',
    category: 'Academic',
    date: '2026-09-24',
    description: 'Dean of Examinations reminds all students that college-wide whole-day attendance must strictly remain ≥ 75% to receive semester hall tickets without condonation fee.',
    urgent: true,
    author: 'Office of Dean Academics',
  },
  {
    id: 'not-3',
    title: 'FinTech Global Placement Drive — Oct 12',
    category: 'Placement',
    date: '2026-09-22',
    description: 'Recruitment drive for Data Analyst & Software Engineer roles. CGPA cutoff 7.0+. Register through Campus Placement Portal.',
    urgent: false,
    author: 'Training & Placement Cell',
  },
  {
    id: 'not-4',
    title: 'Library Extended Hours during Exam Preparation',
    category: 'Campus',
    date: '2026-09-20',
    description: 'Central Library reading hall will remain open until 11:00 PM on all working days starting next week.',
    urgent: false,
    author: 'Chief Librarian',
  },
];

const DEFAULT_PLACEMENTS: PlacementDrive[] = [
  {
    id: 'pl-1',
    company: 'FinTech Global Solutions',
    role: 'Data Analyst',
    packageLPA: '8.5 LPA',
    driveDate: '2026-10-12',
    eligibilityCgpa: 7.0,
    requiredSkills: ['Python', 'SQL', 'Excel', 'Power BI'],
    location: 'Bangalore / Hybrid',
    status: 'Open',
    description: 'Analyze transaction streams, formulate automated fraud dashboards, and build SQL database queries.',
  },
  {
    id: 'pl-2',
    company: 'CogniScale AI Labs',
    role: 'Associate Machine Learning Engineer',
    packageLPA: '12.0 LPA',
    driveDate: '2026-10-28',
    eligibilityCgpa: 8.0,
    requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Data Structures'],
    location: 'Hyderabad / Chennai',
    status: 'Open',
    description: 'Design and deploy state-of-the-art vision and tabular prediction models on cloud GPUs.',
  },
  {
    id: 'pl-3',
    company: 'CloudVertex Systems',
    role: 'Cloud Solutions Associate',
    packageLPA: '9.0 LPA',
    driveDate: '2026-11-10',
    eligibilityCgpa: 7.5,
    requiredSkills: ['Cloud Computing', 'Linux', 'Python', 'Networking'],
    location: 'Bangalore',
    status: 'Open',
    description: 'Architect scalable cloud infrastructure, implement CI/CD pipelines, and optimize container clusters.',
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'NPTEL Elite Certification in Data Mining',
    category: 'Certification',
    organization: 'IIT Kharagpur / NPTEL',
    date: '2025-05-18',
    description: 'Secured Elite + Silver medal ranking top 5% among 12,000 enrolled candidates across India.',
    verified: true,
    credentialUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS10',
  },
  {
    id: 'ach-2',
    title: 'Smart India Hackathon Finalist',
    category: 'Hackathon',
    organization: 'Ministry of Education & AICTE',
    date: '2025-11-20',
    description: 'Built an AI-powered smart crop disease detector using multi-spectral drone imagery in a 36-hour hackathon.',
    verified: true,
  },
  {
    id: 'ach-3',
    title: 'Python & Data Analytics Internship',
    category: 'Internship',
    organization: 'Data Insights Inc, Tech Park',
    date: '2025-07-30',
    description: '8-week full-time summer internship developing automated ETL pipelines and visual interactive dashboards.',
    verified: true,
  },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Semester 4 Official Grade Sheet',
    category: 'Academic',
    uploadDate: '2025-07-20',
    fileSize: '1.4 MB',
    fileType: 'PDF / Image',
    isResult: true,
  },
  {
    id: 'doc-2',
    name: 'College Bonafide Certificate (2025-2026)',
    category: 'Academic',
    uploadDate: '2026-08-10',
    fileSize: '820 KB',
    fileType: 'PDF',
  },
  {
    id: 'doc-3',
    name: 'Student ID Card (CM2026-001)',
    category: 'Personal',
    uploadDate: '2024-08-01',
    fileSize: '450 KB',
    fileType: 'PNG',
  },
  {
    id: 'doc-4',
    name: 'NPTEL Elite Certificate - Data Mining',
    category: 'Career',
    uploadDate: '2025-06-02',
    fileSize: '1.8 MB',
    fileType: 'PDF',
  },
  {
    id: 'doc-5',
    name: 'First Graduate Declaration Affidavit',
    category: 'Scholarship',
    uploadDate: '2024-09-12',
    fileSize: '1.1 MB',
    fileType: 'PDF',
  },
];

const DEFAULT_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-1',
    name: 'Main Entrance & Security Gate',
    code: 'GATE-01',
    category: 'Facility',
    coordinates: { x: 12, y: 82 },
    floor: 'Ground Level',
    timings: '24/7 Open',
    contact: '+91 44 2800 1001',
    description: 'Primary vehicular and pedestrian access gate with security check and visitor verification.',
  },
  {
    id: 'loc-2',
    name: 'Central Library & Learning Hub',
    code: 'LIB-01',
    category: 'Academic',
    coordinates: { x: 38, y: 35 },
    floor: 'Floors 1-3 (East Wing)',
    timings: '08:00 AM - 10:00 PM',
    contact: '+91 44 2800 1020',
    description: 'Houses 60,000+ volumes, IEEE digital access lab, group study cubicles, and quiet reading zones.',
  },
  {
    id: 'loc-3',
    name: 'Dr. APJ Abdul Kalam Auditorium',
    code: 'AUD-01',
    category: 'Facility',
    coordinates: { x: 68, y: 28 },
    floor: 'Ground + Balcony',
    timings: 'Events Only',
    contact: '+91 44 2800 1045',
    description: '1,500-seat acoustic auditorium for symposiums, placement drives, cultural fests, and convocations.',
  },
  {
    id: 'loc-4',
    name: 'Food Court & Student Canteen',
    code: 'CAN-01',
    category: 'Facility',
    coordinates: { x: 28, y: 65 },
    floor: 'Ground Floor',
    timings: '07:30 AM - 08:30 PM',
    contact: '+91 44 2800 1090',
    description: 'Multi-cuisine vegetarian & non-vegetarian food counters, fresh fruit juice bar, and coffee lounge.',
  },
  {
    id: 'loc-5',
    name: 'AI & Data Science Block',
    code: 'AIDS-BLK',
    category: 'Academic',
    coordinates: { x: 52, y: 48 },
    floor: 'Floors 2 & 3 (Tech Complex)',
    timings: '08:30 AM - 06:00 PM',
    contact: '+91 44 2800 1150',
    description: 'Abisha’s core department: Machine Learning Labs 4 & 5, GPU Server room, Faculty cabins, and HOD Office.',
  },
  {
    id: 'loc-6',
    name: 'Central Computing & GPU Labs',
    code: 'LAB-COMP',
    category: 'Academic',
    coordinates: { x: 62, y: 55 },
    floor: 'Ground & 1st Floor',
    timings: '08:00 AM - 08:00 PM',
    contact: '+91 44 2800 1155',
    description: 'High-performance workstations with NVIDIA GPUs, cloud computing cluster, and high-speed gigabit LAN.',
  },
  {
    id: 'loc-7',
    name: 'Office of Controller of Examinations',
    code: 'EXAM-CELL',
    category: 'Admin',
    coordinates: { x: 44, y: 70 },
    floor: 'Ground Floor, Admin Block',
    timings: '09:00 AM - 04:30 PM',
    contact: '+91 44 2800 1015',
    description: 'Semester exam registrations, grade card distribution, official transcripts, and revaluation counter.',
  },
  {
    id: 'loc-8',
    name: 'Principal & Dean Secretariat',
    code: 'ADMIN-PRIN',
    category: 'Admin',
    coordinates: { x: 42, y: 80 },
    floor: '1st Floor, Main Admin Block',
    timings: '09:00 AM - 05:00 PM',
    contact: '+91 44 2800 1005',
    description: 'Executive college administration, student affairs office, and academic council meeting hall.',
  },
  {
    id: 'loc-9',
    name: 'Kaveri Women’s Hostel Complex',
    code: 'HOSTEL-KW',
    category: 'Hostel',
    coordinates: { x: 82, y: 72 },
    floor: 'Blocks A, B, C',
    timings: 'Curfew: 08:30 PM',
    contact: '+91 44 2800 1099',
    description: 'Resident student rooms, dining hall, indoor recreation room, and 24-hour warden security desk.',
  },
  {
    id: 'loc-10',
    name: 'Main Sports Complex & Track',
    code: 'SPORT-01',
    category: 'Sports',
    coordinates: { x: 80, y: 22 },
    floor: 'Outdoor & Indoor Arena',
    timings: '06:00 AM - 07:30 PM',
    contact: '+91 44 2800 1088',
    description: '400m synthetic running track, basketball & badminton courts, football ground, and student fitness gym.',
  },
  {
    id: 'loc-11',
    name: 'Campus Parking Zone B',
    code: 'PARK-02',
    category: 'Facility',
    coordinates: { x: 18, y: 90 },
    floor: 'Ground Level',
    timings: '06:00 AM - 10:00 PM',
    contact: 'Security Post 1',
    description: 'Covered two-wheeler and four-wheeler parking with EV charging points and student permit verification.',
  },
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔴 DBMS Assignment Due Today!',
    message: 'Your DBMS Relational Calculus assignment is due today at 5:00 PM. 2 assignments remain pending.',
    timestamp: '15 mins ago',
    read: false,
    type: 'deadline',
    targetTab: 'deadlines',
  },
  {
    id: 'notif-2',
    title: 'Attendance Status: 78% (Safe)',
    message: 'Your overall college attendance is 78% (78/100 days). You are 3% above the 75% required threshold.',
    timestamp: '2 hours ago',
    read: false,
    type: 'attendance',
    targetTab: 'attendance',
  },
  {
    id: 'notif-3',
    title: 'Merit Scholarship Deadline Approaching',
    message: 'Merit Scholarship (₹50,000) applications close in 18 days on Oct 15, 2026. You are eligible!',
    timestamp: '1 day ago',
    read: false,
    type: 'scholarship',
    targetTab: 'scholarships',
  },
  {
    id: 'notif-4',
    title: 'Placement Drive: FinTech Global (8.5 LPA)',
    message: 'FinTech Global Data Analyst recruitment drive is scheduled for Oct 12, 2026. CGPA cutoff: 7.0+.',
    timestamp: '2 days ago',
    read: true,
    type: 'placement',
    targetTab: 'career',
  },
  {
    id: 'notif-5',
    title: 'Semester 4 Result Card Synced',
    message: 'Semester 4 GPA: 8.45 confirmed and saved. Cumulative CGPA updated to 8.29.',
    timestamp: '3 days ago',
    read: true,
    type: 'academic',
    targetTab: 'results',
  },
];

export const TAB_NAMES: Record<TabType, string> = {
  'dashboard': 'Dashboard',
  'ai-assistant': 'CampusMate AI',
  'attendance': 'Attendance Command Center',
  'results': 'Results & CGPA',
  'scholarships': 'Scholarships Finder',
  'academics': 'Academics & Timetable',
  'deadlines': 'Deadlines Tracker',
  'notices': 'Notices & Circulars',
  'career': 'Career & Placements',
  'achievements': 'Achievements Wallet',
  'resume': 'Resume Builder',
  'documents': 'Documents Vault',
  'campus-map': 'Campus Map & Directions',
  'emergency': 'Emergency Contacts & SOS',
  'profile': 'Student Profile',
};

const CampusMateContext = createContext<CampusMateContextType | null>(null);

export const CampusMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('dashboard');
  const [history, setHistory] = useState<TabType[]>([]);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState((current) => {
      if (current === tab) return current;
      setHistory((prev) => [...prev, current]);
      return tab;
    });
  };

  const goBack = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const prev = prevHistory[prevHistory.length - 1];
        setActiveTabState(prev);
        return prevHistory.slice(0, -1);
      }
      setActiveTabState('dashboard');
      return [];
    });
  };

  const canGoBack = history.length > 0 || activeTab !== 'dashboard';
  const previousTab = history.length > 0 ? history[history.length - 1] : (activeTab !== 'dashboard' ? 'dashboard' : null);

  // Core state with local storage persistence
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_student`);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
      return saved ? JSON.parse(saved) : DEFAULT_ATTENDANCE;
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  });

  const [semesters, setSemesters] = useState<SemesterResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_semesters`);
      return saved ? JSON.parse(saved) : DEFAULT_SEMESTERS;
    } catch {
      return DEFAULT_SEMESTERS;
    }
  });

  const [gradingConfig, setGradingConfig] = useState<GradingConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_gradingConfig`);
      return saved ? JSON.parse(saved) : DEFAULT_GRADING_CONFIG;
    } catch {
      return DEFAULT_GRADING_CONFIG;
    }
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_scholarships`);
      return saved ? JSON.parse(saved) : DEFAULT_SCHOLARSHIPS;
    } catch {
      return DEFAULT_SCHOLARSHIPS;
    }
  });

  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_deadlines`);
      return saved ? JSON.parse(saved) : DEFAULT_DEADLINES;
    } catch {
      return DEFAULT_DEADLINES;
    }
  });

  const [timetable] = useState<TimetableClass[]>(DEFAULT_TIMETABLE);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
      return saved ? JSON.parse(saved) : DEFAULT_ASSIGNMENTS;
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
      return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
    } catch {
      return DEFAULT_NOTICES;
    }
  });

  const [placements, setPlacements] = useState<PlacementDrive[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_placements`);
      return saved ? JSON.parse(saved) : DEFAULT_PLACEMENTS;
    } catch {
      return DEFAULT_PLACEMENTS;
    }
  });

  const [skillScores, setSkillScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_skillScores`);
      return saved ? JSON.parse(saved) : { Python: 80, Excel: 80, SQL: 60, 'Power BI': 50 };
    } catch {
      return { Python: 80, Excel: 80, SQL: 60, 'Power BI': 50 };
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
      return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  });

  const [campusLocations] = useState<CampusLocation[]>(DEFAULT_CAMPUS_LOCATIONS);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_student`, JSON.stringify(student));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY}_semesters`, JSON.stringify(semesters));
      localStorage.setItem(`${STORAGE_KEY}_gradingConfig`, JSON.stringify(gradingConfig));
      localStorage.setItem(`${STORAGE_KEY}_scholarships`, JSON.stringify(scholarships));
      localStorage.setItem(`${STORAGE_KEY}_deadlines`, JSON.stringify(deadlines));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY}_placements`, JSON.stringify(placements));
      localStorage.setItem(`${STORAGE_KEY}_skillScores`, JSON.stringify(skillScores));
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
      localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [student, attendance, semesters, gradingConfig, scholarships, deadlines, assignments, notices, placements, skillScores, achievements, documents, notifications]);

  // Overall CGPA calculation using configured rules
  const calculateOverallCgpa = (resultsList: SemesterResult[] = semesters): number => {
    if (!resultsList || resultsList.length === 0) return 0;

    if (gradingConfig.system === 'weighted') {
      let totalQualityPoints = 0;
      let totalCredits = 0;
      resultsList.forEach((sem) => {
        totalQualityPoints += sem.gpa * sem.totalCredits;
        totalCredits += sem.totalCredits;
      });
      return totalCredits > 0 ? Number((totalQualityPoints / totalCredits).toFixed(2)) : 0;
    } else {
      // Simple arithmetic average of semester GPAs
      const sum = resultsList.reduce((acc, sem) => acc + sem.gpa, 0);
      return Number((sum / resultsList.length).toFixed(2));
    }
  };

  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...updates }));
  };

  const updateAttendance = (presentDays: number, workingDays: number) => {
    if (workingDays <= 0 || presentDays < 0 || presentDays > workingDays) return;
    const pct = Number(((presentDays / workingDays) * 100).toFixed(2));
    setAttendance((prev) => ({
      ...prev,
      presentDays,
      workingDays,
      lastUpdated: new Date().toISOString(),
    }));

    // Trigger warning if below 75%
    if (pct < 75) {
      addNotification({
        title: '⚠️ Attendance Shortage Warning!',
        message: `Your college attendance has dropped to ${pct}% (${presentDays}/${workingDays} days). Required minimum is 75%.`,
        type: 'attendance',
        targetTab: 'attendance',
      });
    }
  };

  const markTodayAttendance = (status: 'present' | 'absent') => {
    setAttendance((prev) => {
      const newWorking = prev.workingDays + 1;
      const newPresent = status === 'present' ? prev.presentDays + 1 : prev.presentDays;
      const todayStr = new Date().toISOString().split('T')[0];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[new Date().getDay()];

      return {
        ...prev,
        workingDays: newWorking,
        presentDays: newPresent,
        lastUpdated: new Date().toISOString(),
        history: [{ date: todayStr, status, dayName: todayName }, ...prev.history.slice(0, 14)],
      };
    });

    addNotification({
      title: `Today's Attendance Marked: ${status.toUpperCase()}`,
      message: `Updated to ${status === 'present' ? attendance.presentDays + 1 : attendance.presentDays} / ${attendance.workingDays + 1} days.`,
      type: 'attendance',
      targetTab: 'attendance',
    });
  };

  const addSemesterResult = (newSem: Omit<SemesterResult, 'id' | 'dateAdded'>) => {
    const id = `sem-${Date.now()}`;
    const newEntry: SemesterResult = {
      ...newSem,
      id,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const updatedList = [...semesters, newEntry].sort((a, b) => a.semesterNumber - b.semesterNumber);
    setSemesters(updatedList);

    // Automatically recalculate and sync student profile CGPA and latest GPA
    const newCgpa = calculateOverallCgpa(updatedList);
    setStudent((prev) => ({
      ...prev,
      currentCgpa: newCgpa,
      latestGpa: newSem.gpa,
    }));

    addNotification({
      title: `🎉 ${newSem.semesterName} Verified & Saved!`,
      message: `GPA: ${newSem.gpa.toFixed(2)}. Your new cumulative CGPA is ${newCgpa.toFixed(2)}.`,
      type: 'academic',
      targetTab: 'results',
    });
  };

  const deleteSemesterResult = (id: string) => {
    const updated = semesters.filter((s) => s.id !== id);
    setSemesters(updated);
    const newCgpa = calculateOverallCgpa(updated);
    const latest = updated.length > 0 ? updated[updated.length - 1].gpa : 0;
    setStudent((prev) => ({
      ...prev,
      currentCgpa: newCgpa,
      latestGpa: latest,
    }));
  };

  const updateGradingConfig = (newConfig: Partial<GradingConfig>) => {
    const merged = { ...gradingConfig, ...newConfig };
    setGradingConfig(merged);
    const newCgpa = calculateOverallCgpa(semesters);
    setStudent((prev) => ({ ...prev, currentCgpa: newCgpa }));
  };

  const updateScholarshipStatus = (id: string, status: Scholarship['status']) => {
    setScholarships((prev) =>
      prev.map((sch) => (sch.id === id ? { ...sch, status } : sch))
    );
    const target = scholarships.find((s) => s.id === id);
    if (target) {
      addNotification({
        title: `Scholarship Application Updated`,
        message: `${target.name} status is now marked as "${status}".`,
        type: 'scholarship',
        targetTab: 'scholarships',
      });
    }
  };

  const addDeadline = (deadline: Omit<Deadline, 'id' | 'completed'>) => {
    const id = `dl-${Date.now()}`;
    const newDl: Deadline = { ...deadline, id, completed: false };
    setDeadlines((prev) => [newDl, ...prev]);

    addNotification({
      title: `New Deadline Added: ${newDl.title}`,
      message: `Due on ${newDl.date} at ${newDl.time || '23:59'}. Priority: ${newDl.priority}`,
      type: 'deadline',
      targetTab: 'deadlines',
    });
  };

  const updateDeadline = (id: string, updates: Partial<Deadline>) => {
    setDeadlines((prev) => prev.map((dl) => (dl.id === id ? { ...dl, ...updates } : dl)));
  };

  const toggleDeadline = (id: string) => {
    setDeadlines((prev) =>
      prev.map((dl) => {
        if (dl.id === id) {
          const nextState = !dl.completed;
          if (nextState) {
            // Also mark corresponding assignment complete if linked
            if (dl.relatedId && dl.relatedId.startsWith('asg-')) {
              setAssignments((asgs) =>
                asgs.map((a) => (a.id === dl.relatedId ? { ...a, status: 'Submitted' } : a))
              );
            }
          }
          return { ...dl, completed: nextState };
        }
        return dl;
      })
    );
  };

  const snoozeDeadline = (id: string, days: number) => {
    setDeadlines((prev) =>
      prev.map((dl) => {
        if (dl.id === id) {
          const current = new Date(dl.date);
          current.setDate(current.getDate() + days);
          const newDate = current.toISOString().split('T')[0];
          return { ...dl, date: newDate, snoozedUntil: newDate };
        }
        return dl;
      })
    );
    addNotification({
      title: `Deadline Snoozed (+${days} days)`,
      message: `Updated due date to reflect extra preparation window.`,
      type: 'deadline',
      targetTab: 'deadlines',
    });
  };

  const deleteDeadline = (id: string) => {
    setDeadlines((prev) => prev.filter((dl) => dl.id !== id));
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    const newAsg: Assignment = { ...assignment, id };
    setAssignments((prev) => [newAsg, ...prev]);

    // Automatically create synchronized deadline entry
    addDeadline({
      title: `${newAsg.title} (${newAsg.subject})`,
      category: 'Assignment',
      date: newAsg.dueDate,
      time: '17:00',
      description: newAsg.description,
      priority: newAsg.priority,
      relatedId: id,
    });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice = { ...notice, id: `not-${Date.now()}` };
    setNotices((prev) => [newNotice, ...prev]);
    addNotification({
      title: `📢 New Campus Notice: ${newNotice.title}`,
      message: newNotice.description,
      type: 'academic',
      targetTab: 'notices',
    });
  };

  const applyPlacement = (id: string) => {
    setPlacements((prev) =>
      prev.map((pl) => (pl.id === id ? { ...pl, status: 'Applied' } : pl))
    );
    const drive = placements.find((p) => p.id === id);
    if (drive) {
      addNotification({
        title: `Applied for ${drive.company}`,
        message: `Registered for ${drive.role} (${drive.packageLPA}). Drive date: ${drive.driveDate}.`,
        type: 'placement',
        targetTab: 'career',
      });
      // Add placement deadline to calendar
      addDeadline({
        title: `${drive.company} Placement Drive`,
        category: 'Placement',
        date: drive.driveDate,
        time: '09:00',
        description: `Campus recruitment drive for ${drive.role}. Venue: Placement Cell.`,
        priority: 'High',
        relatedId: id,
      });
    }
  };

  const updateSkillScore = (skill: string, score: number) => {
    setSkillScores((prev) => ({ ...prev, [skill]: score }));
    setStudent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.name.toLowerCase().includes(skill.toLowerCase()) ? { ...s, level: score } : s)),
    }));
  };

  const addAchievement = (achievement: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...achievement, id: `ach-${Date.now()}` };
    setAchievements((prev) => [newAch, ...prev]);
    addNotification({
      title: `🏆 Achievement Added: ${newAch.title}`,
      message: `Stored in your digital portfolio & resume builder.`,
      type: 'academic',
      targetTab: 'achievements',
    });
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const togglePresentationMode = () => {
    setPresentationMode((prev) => !prev);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setStudent(DEFAULT_STUDENT);
    setAttendance(DEFAULT_ATTENDANCE);
    setSemesters(DEFAULT_SEMESTERS);
    setGradingConfig(DEFAULT_GRADING_CONFIG);
    setScholarships(DEFAULT_SCHOLARSHIPS);
    setDeadlines(DEFAULT_DEADLINES);
    setAssignments(DEFAULT_ASSIGNMENTS);
    setNotices(DEFAULT_NOTICES);
    setPlacements(DEFAULT_PLACEMENTS);
    setSkillScores({ Python: 80, Excel: 80, SQL: 60, 'Power BI': 50 });
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setDocuments(DEFAULT_DOCUMENTS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setStudyPlan(null);
    setActiveTab('dashboard');
  };

  return (
    <CampusMateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        history,
        goBack,
        canGoBack,
        previousTab,
        student,
        updateStudent,
        attendance,
        updateAttendance,
        markTodayAttendance,
        semesters,
        addSemesterResult,
        deleteSemesterResult,
        gradingConfig,
        updateGradingConfig,
        calculateOverallCgpa,
        scholarships,
        updateScholarshipStatus,
        deadlines,
        addDeadline,
        updateDeadline,
        toggleDeadline,
        snoozeDeadline,
        deleteDeadline,
        timetable,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        notices,
        addNotice,
        placements,
        applyPlacement,
        skillScores,
        updateSkillScore,
        achievements,
        addAchievement,
        deleteAchievement,
        documents,
        addDocument,
        deleteDocument,
        campusLocations,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        studyPlan,
        setStudyPlan,
        presentationMode,
        togglePresentationMode,
        globalSearchOpen,
        setGlobalSearchOpen,
        resetDemoData,
      }}
    >
      {children}
    </CampusMateContext.Provider>
  );
};

export const useCampusMate = () => {
  const context = useContext(CampusMateContext);
  if (!context) {
    throw new Error('useCampusMate must be used within a CampusMateProvider');
  }
  return context;
};
