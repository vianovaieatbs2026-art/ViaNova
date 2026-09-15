import { UserProfile } from '../types';

export interface UserDashboardProgress {
  totalProgress: number; // 0 - 100
  completedModulesCount: number; // 0, 1, 2, ...
  quizAverage: number; // 0 or formatted decimal e.g. 8.5
  badgesCount: number; // 0, 1, 2, 3
  hasProgress: boolean; // false if user is new and has no progress
}

const COMPLETED_MODULES_PREFIX = 'vianova_completed_modules_';
const QUIZ_HISTORY_PREFIX = 'vianova_quiz_history_';
const EXAM_RESULTS_PREFIX = 'vianova_exam_results_';

export function getUserCompletedModules(email?: string): string[] {
  if (!email || typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${COMPLETED_MODULES_PREFIX}${email.trim().toLowerCase()}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading completed modules:', err);
    return [];
  }
}

export function setUserCompletedModules(email: string, modules: string[]): void {
  if (!email || typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${COMPLETED_MODULES_PREFIX}${email.trim().toLowerCase()}`,
      JSON.stringify(modules)
    );
  } catch (err) {
    console.warn('Error saving completed modules:', err);
  }
}

export function toggleUserCompletedModule(email: string, moduleId: string): string[] {
  const current = getUserCompletedModules(email);
  const updated = current.includes(moduleId)
    ? current.filter(id => id !== moduleId)
    : [...current, moduleId];
  setUserCompletedModules(email, updated);
  return updated;
}

export function getUserQuizScores(email?: string): number[] {
  if (!email || typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${QUIZ_HISTORY_PREFIX}${email.trim().toLowerCase()}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => (typeof item === 'number' ? item : item?.score || 0));
    }
    return [];
  } catch (err) {
    console.warn('Error reading quiz scores:', err);
    return [];
  }
}

export function recordUserQuizScore(email: string, scoreOutOf10: number): void {
  if (!email || typeof window === 'undefined') return;
  try {
    const scores = getUserQuizScores(email);
    scores.push(Math.min(10, Math.max(0, scoreOutOf10)));
    localStorage.setItem(
      `${QUIZ_HISTORY_PREFIX}${email.trim().toLowerCase()}`,
      JSON.stringify(scores)
    );
  } catch (err) {
    console.warn('Error recording quiz score:', err);
  }
}

export function getUserExamPassedCount(email?: string): number {
  if (!email || typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(`${EXAM_RESULTS_PREFIX}${email.trim().toLowerCase()}`);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item: any) => item?.passed).length;
    }
    return 0;
  } catch (err) {
    console.warn('Error reading exam results:', err);
    return 0;
  }
}

export function recordUserExamResult(email: string, passed: boolean): void {
  if (!email || typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(`${EXAM_RESULTS_PREFIX}${email.trim().toLowerCase()}`);
    const results = raw ? JSON.parse(raw) : [];
    results.push({ passed, date: new Date().toISOString() });
    localStorage.setItem(
      `${EXAM_RESULTS_PREFIX}${email.trim().toLowerCase()}`,
      JSON.stringify(results)
    );
  } catch (err) {
    console.warn('Error saving exam result:', err);
  }
}

/**
 * Computes live, dynamic user dashboard progress.
 * If user is newly registered or has completed nothing, all numbers are strictly 0.
 */
export function getUserDashboardProgress(user: UserProfile | null): UserDashboardProgress {
  if (!user) {
    return {
      totalProgress: 0,
      completedModulesCount: 0,
      quizAverage: 0,
      badgesCount: 0,
      hasProgress: false,
    };
  }

  const completedModules = getUserCompletedModules(user.email);
  const completedCount = completedModules.length;

  const quizScores = getUserQuizScores(user.email);
  const quizAvg = quizScores.length > 0 
    ? Math.round((quizScores.reduce((acc, val) => acc + val, 0) / quizScores.length) * 10) / 10 
    : 0;

  const passedExams = Math.max(user.passedExams || 0, getUserExamPassedCount(user.email));

  // Determine earned badges count:
  // Badge 1: Read at least 1 education module
  // Badge 2: Passed at least 1 quiz with score >= 7
  // Badge 3: Passed simulator exam or completed all 4 modules
  let earnedBadges = 0;
  if (completedCount >= 1) earnedBadges++;
  if (quizScores.some(s => s >= 7)) earnedBadges++;
  if (passedExams >= 1 || completedCount >= 4) earnedBadges++;

  // Check if user has ANY progress:
  // Note: if user has no completed modules, no quizzes, no passed exams, and completedHours is 0
  const hasProgress = completedCount > 0 || quizScores.length > 0 || passedExams > 0 || (user.completedHours || 0) > 0;

  if (!hasProgress) {
    return {
      totalProgress: 0,
      completedModulesCount: 0,
      quizAverage: 0,
      badgesCount: 0,
      hasProgress: false,
    };
  }

  // Calculate total progress percentage (out of 100%)
  // 4 modules total (50%), quizzes (25%), simulator (25%)
  const modulesPct = Math.min(50, (completedCount / 4) * 50);
  const quizPct = quizScores.length > 0 ? 25 : 0;
  const examPct = passedExams > 0 ? 25 : 0;
  const totalPct = Math.min(100, Math.round(modulesPct + quizPct + examPct));

  return {
    totalProgress: totalPct,
    completedModulesCount: completedCount,
    quizAverage: quizAvg,
    badgesCount: earnedBadges,
    hasProgress: true,
  };
}
