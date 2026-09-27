/**
 * CampusMate AI Service
 * Handles communication with the Gemini AI backend API or falls back to
 * high-fidelity deterministic computation when running as a standalone Vite client.
 */

export interface StudentContextData {
  name: string;
  studentId: string;
  department: string;
  year: string;
  cgpa: number;
  latestGpa: number;
  attendancePercent: number;
  presentDays: number;
  workingDays: number;
  deadlines: { title: string; date: string; priority: string }[];
  assignments: { title: string; status: string }[];
  scholarships: { name: string; amount: string; deadline: string }[];
}

export async function askCampusMateAI(
  message: string,
  context: StudentContextData
): Promise<string> {
  // 1. Try backend endpoint first if available
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, studentContext: context }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch {
    // Backend unavailable, fallback to built-in intelligence engine
  }

  // 2. Intelligent offline/standalone response processor
  const query = message.toLowerCase();
  const { presentDays, workingDays, attendancePercent } = context;

  // Question: 1 day leave calculation
  if (query.includes('one day leave') || query.includes('1 day leave') || (query.includes('leave') && query.includes('one'))) {
    const newWorking = workingDays + 1;
    const projected = Number(((presentDays / newWorking) * 100).toFixed(2));
    const safe = projected >= 75;
    return `Based on your official record (**${presentDays}** present out of **${workingDays}** working days = **${attendancePercent}%**):\n\nIf you take **1 day of leave**:\n- Present Days: **${presentDays}**\n- Total Working Days: **${newWorking}**\n- Projected Attendance: **${projected}%**\n\n${
      safe
        ? `✅ **SAFE**: Your projected attendance will remain **above the required 75%** threshold.`
        : `⚠️ **WARNING**: Your projected attendance will fall **below the 75%** threshold!`
    }`;
  }

  // Question: How many days can I safely take leave?
  if (query.includes('safely take leave') || query.includes('safe leave') || query.includes('how many days can i')) {
    // Formula: present / (working + X) >= 0.75 => X <= (present - 0.75 * working) / 0.75
    const maxLeaves = Math.max(0, Math.floor((presentDays - 0.75 * workingDays) / 0.75));
    const attendanceAfterMax = ((presentDays / (workingDays + maxLeaves)) * 100).toFixed(2);
    return `You currently have **${presentDays}** present days out of **${workingDays}** working days (**${attendancePercent}%**).\n\n🛡️ **Safe Leave Buffer:**\nYou can safely take up to **${maxLeaves} working day(s)** of leave while staying at or above the mandatory 75% requirement (Projected: **${attendanceAfterMax}%**).\n\nTaking ${maxLeaves + 1} or more days will drop your attendance below 75% and trigger an attendance shortage alert.`;
  }

  // Question: Target attendance recovery (e.g. 80%)
  if (query.includes('80%') || query.includes('target') || query.includes('reach')) {
    const target = 0.8;
    const needed = Math.max(0, Math.ceil((target * workingDays - presentDays) / (1 - target)));
    return `To elevate your attendance from **${attendancePercent}%** to **80%**:\n\n📈 **Recovery Calculation:**\n- Formula: (Present + Days) / (Working + Days) ≥ 80%\n- You need to attend **${needed} consecutive full working days** without absence.\n\nAfter attending ${needed} continuous days, your record will be **${presentDays + needed}/${workingDays + needed}** = **80.0%**.`;
  }

  // Question: Scholarships
  if (query.includes('scholarship') || query.includes('grant') || query.includes('financial aid')) {
    const eligibleList = context.scholarships
      .map((s) => `• **${s.name}** — ${s.amount} (Deadline: ${s.deadline})`)
      .join('\n');
    return `🎓 **Scholarships Available for You:**\n\nWith your current **${context.cgpa.toFixed(2)} CGPA** in ${context.department}, you are eligible for the following institutional grants:\n\n${eligibleList}\n\nCheck the **Scholarships** tab to view document requirements and submit applications.`;
  }

  // Question: Deadlines
  if (query.includes('deadline') || query.includes('due') || query.includes('pending')) {
    const dList = context.deadlines
      .map((d) => `• **${d.title}** (${d.priority} Priority) — Due ${d.date}`)
      .join('\n');
    return `⏰ **Upcoming Critical Deadlines:**\n\n${dList}\n\nCampusMate recommends completing the highest priority items first to prevent late academic submissions.`;
  }

  // Question: CGPA & GPA
  if (query.includes('cgpa') || query.includes('gpa') || query.includes('result') || query.includes('grade')) {
    return `📊 **Academic Performance Summary for ${context.name}:**\n\n• **Current Cumulative CGPA:** **${context.cgpa.toFixed(2)}** / 10.0\n• **Latest Semester (Sem 4) GPA:** **${context.latestGpa.toFixed(2)}** / 10.0\n• **Status:** First Class with Distinction eligibility.\n\nYou can simulate next semester goals or scan new semester marksheets in the **Results & CGPA** tab.`;
  }

  // General default answer
  return `Hello ${context.name}! I am CampusMate AI, your college copilot. Here is a quick snapshot of your status:\n\n• **Whole-Day Attendance:** **${presentDays}/${workingDays}** days (**${attendancePercent}%**) — Policy requires ≥75%.\n• **Current CGPA:** **${context.cgpa.toFixed(2)}** (Department: ${context.department}).\n• **Pending Deadlines:** ${context.deadlines.length} scheduled items.\n\nYou can ask me specific questions like: *"If I take one day leave, what will my attendance be?"*, *"How many days can I safely take leave?"*, or *"How many days to reach 80% attendance?"*`;
}
