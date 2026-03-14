// ========================================
// ORBIT — データストア（localStorage CRUD）
// ========================================

import { STORAGE_KEYS } from './constants.js';
import { MOCK_USERS, MOCK_PROGRESS, MOCK_PRACTICE_LOGS, MOCK_EVALUATIONS, MOCK_SURVEYS } from './mockData.js';

// ---- 汎用 localStorage ヘルパー ----
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- Users ----
export function loadUsers() { return load(STORAGE_KEYS.USERS, MOCK_USERS); }
export function saveUsers(d) { save(STORAGE_KEYS.USERS, d); }

// ---- Progress ----
export function loadProgress() { return load(STORAGE_KEYS.PROGRESS, MOCK_PROGRESS); }
export function saveProgress(d) { save(STORAGE_KEYS.PROGRESS, d); }

export function getStudentProgress(progress, studentId, grade) {
  return progress[studentId]?.[grade] || {};
}

export function getContentProgress(progress, studentId, grade, contentId) {
  return progress[studentId]?.[grade]?.[contentId] || { videoDone: false, quizDone: false, practiceCount: 0 };
}

export function updateContentProgress(progress, studentId, grade, contentId, updates) {
  const next = JSON.parse(JSON.stringify(progress));
  if (!next[studentId]) next[studentId] = {};
  if (!next[studentId][grade]) next[studentId][grade] = {};
  next[studentId][grade][contentId] = {
    ...getContentProgress(next, studentId, grade, contentId),
    ...updates,
  };
  return next;
}

// ---- Practice Logs ----
export function loadPracticeLogs() { return load(STORAGE_KEYS.PRACTICE_LOGS, MOCK_PRACTICE_LOGS); }
export function savePracticeLogs(d) { save(STORAGE_KEYS.PRACTICE_LOGS, d); }

export function getLogs(logs, studentId, grade, contentId) {
  return logs[studentId]?.[grade]?.[contentId] || [];
}

export function getLogCount(logs, studentId, grade, contentId) {
  return getLogs(logs, studentId, grade, contentId).length;
}

export function addLog(logs, studentId, grade, contentId, entry) {
  const next = JSON.parse(JSON.stringify(logs));
  if (!next[studentId]) next[studentId] = {};
  if (!next[studentId][grade]) next[studentId][grade] = {};
  if (!next[studentId][grade][contentId]) next[studentId][grade][contentId] = [];
  next[studentId][grade][contentId].push({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  });
  return next;
}

export function deleteLog(logs, studentId, grade, contentId, logId) {
  const next = JSON.parse(JSON.stringify(logs));
  if (next[studentId]?.[grade]?.[contentId]) {
    next[studentId][grade][contentId] = next[studentId][grade][contentId].filter(l => l.id !== logId);
  }
  return next;
}

// ---- Evaluations ----
export function loadEvaluations() { return load(STORAGE_KEYS.EVALUATIONS, MOCK_EVALUATIONS); }
export function saveEvaluations(d) { save(STORAGE_KEYS.EVALUATIONS, d); }

// ---- Surveys ----
export function loadSurveys() { return load(STORAGE_KEYS.SURVEYS, MOCK_SURVEYS); }
export function saveSurveys(d) { save(STORAGE_KEYS.SURVEYS, d); }

// ---- Auth ----
export function loadAuth() { return load(STORAGE_KEYS.AUTH, null); }
export function saveAuth(d) { save(STORAGE_KEYS.AUTH, d); }
export function clearAuth() { localStorage.removeItem(STORAGE_KEYS.AUTH); }

// ---- Reset（デモ用） ----
export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}

// ---- 集計ヘルパー ----
export function calcCompletionRate(progress, studentId, grade, contents) {
  const sp = getStudentProgress(progress, studentId, grade);
  let completed = 0;
  contents.forEach(c => {
    const p = sp[c.id];
    if (p && p.videoDone && p.quizDone && p.practiceCount >= c.step3Required) {
      completed++;
    }
  });
  return contents.length > 0 ? completed / contents.length : 0;
}

export function calcHospitalAverages(evaluations, hospitalId) {
  const evals = evaluations.filter(e => e.hospitalId === hospitalId);
  if (evals.length === 0) return null;
  const cats = ['teaching', 'feedback', 'environment', 'accessibility', 'overall'];
  const averages = {};
  cats.forEach(cat => {
    const sum = evals.reduce((acc, e) => acc + (e.scores[cat] || 0), 0);
    averages[cat] = sum / evals.length;
  });
  averages.count = evals.length;
  return averages;
}
