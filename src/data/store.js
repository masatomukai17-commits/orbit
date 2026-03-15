// ========================================
// ORBIT v2.0 — データストア（localStorage CRUD）
// ========================================

import { STORAGE_KEYS, ECHO_LADDER } from './constants.js';
import { MOCK_USERS, MOCK_LADDER_PROGRESS, MOCK_LADDER_LOGS, MOCK_OB_CASES, MOCK_GYN_CASES, MOCK_OB_MATRIX, MOCK_LAPARO_TIMES, MOCK_EVALUATIONS, MOCK_SURVEYS } from './mockData.js';

// ---- 汎用 load/save ----
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- ユーザー ----
export function loadUsers() {
  return load(STORAGE_KEYS.USERS, MOCK_USERS);
}
export function saveUsers(users) {
  save(STORAGE_KEYS.USERS, users);
}

// ---- 認証 ----
export function loadAuth() {
  return load(STORAGE_KEYS.AUTH, null);
}
export function saveAuth(data) {
  save(STORAGE_KEYS.AUTH, data);
}
export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// ---- Echo Ladder進捗 ----
export function loadLadderProgress() {
  return load(STORAGE_KEYS.LADDER_PROGRESS, MOCK_LADDER_PROGRESS);
}
export function saveLadderProgress(data) {
  save(STORAGE_KEYS.LADDER_PROGRESS, data);
}
export function getLadderStep(progress, studentId, grade, contentId) {
  return progress?.[studentId]?.[grade]?.[contentId] || { videoDone: false, quizDone: false, practiceCount: 0 };
}
export function updateLadderStep(progress, studentId, grade, contentId, updates) {
  const copy = JSON.parse(JSON.stringify(progress));
  if (!copy[studentId]) copy[studentId] = {};
  if (!copy[studentId][grade]) copy[studentId][grade] = {};
  copy[studentId][grade][contentId] = { ...getLadderStep(copy, studentId, grade, contentId), ...updates };
  return copy;
}

// ---- Echo Ladder実技ログ ----
export function loadLadderLogs() {
  return load(STORAGE_KEYS.LADDER_LOGS, MOCK_LADDER_LOGS);
}
export function saveLadderLogs(data) {
  save(STORAGE_KEYS.LADDER_LOGS, data);
}
export function getLogs(logs, studentId, grade, contentId) {
  return logs?.[studentId]?.[grade]?.[contentId] || [];
}
export function addLog(logs, studentId, grade, contentId, entry) {
  const copy = JSON.parse(JSON.stringify(logs));
  if (!copy[studentId]) copy[studentId] = {};
  if (!copy[studentId][grade]) copy[studentId][grade] = {};
  if (!copy[studentId][grade][contentId]) copy[studentId][grade][contentId] = [];
  copy[studentId][grade][contentId].push({ ...entry, id: `log_${Date.now()}`, createdAt: new Date().toISOString() });
  return copy;
}
export function deleteLog(logs, studentId, grade, contentId, logId) {
  const copy = JSON.parse(JSON.stringify(logs));
  if (copy?.[studentId]?.[grade]?.[contentId]) {
    copy[studentId][grade][contentId] = copy[studentId][grade][contentId].filter(l => l.id !== logId);
  }
  return copy;
}

// ---- Ladder完了率計算 ----
export function calcLadderCompletion(progress, studentId, grade) {
  let done = 0;
  for (const item of ECHO_LADDER) {
    const step = getLadderStep(progress, studentId, grade, item.id);
    if (step.videoDone && step.quizDone && step.practiceCount >= item.practiceRequired) {
      done++;
    }
  }
  return Math.round((done / ECHO_LADDER.length) * 100);
}

// 全Ladder項目の合計practice数
export function calcTotalEchoPractice(progress, studentId, grades) {
  let total = 0;
  for (const g of grades) {
    for (const item of ECHO_LADDER) {
      total += getLadderStep(progress, studentId, g, item.id).practiceCount;
    }
  }
  return total;
}

// ---- 産科症例（大学/関連別） ----
// obCases[studentId] = { university: { ob_vd, ... }, affiliated: { ob_vd, ... } }
export function loadObCases() {
  return load(STORAGE_KEYS.OB_CASES, MOCK_OB_CASES);
}
export function saveObCases(data) {
  save(STORAGE_KEYS.OB_CASES, data);
}

// ---- 婦人科症例（大学/関連別） ----
// gynCases[studentId] = { university: { catId: { subId: N } }, affiliated: { catId: { subId: N } } }
export function loadGynCases() {
  return load(STORAGE_KEYS.GYN_CASES, MOCK_GYN_CASES);
}
export function saveGynCases(data) {
  save(STORAGE_KEYS.GYN_CASES, data);
}

// ---- 産科マトリクス（疾患×手技） ----
export function loadObMatrix() {
  return load(STORAGE_KEYS.OB_MATRIX, MOCK_OB_MATRIX);
}
export function saveObMatrix(data) {
  save(STORAGE_KEYS.OB_MATRIX, data);
}

// ---- ラパロタイム（秒単位、結紮タイム） ----
// laparoTimes[studentId] = [{ id, date, seconds, memo }]
export function loadLaparoTimes() {
  return load(STORAGE_KEYS.LAPARO_TIMES, MOCK_LAPARO_TIMES);
}
export function saveLaparoTimes(data) {
  save(STORAGE_KEYS.LAPARO_TIMES, data);
}

// ---- 逆評定 ----
export function loadEvaluations() {
  return load(STORAGE_KEYS.EVALUATIONS, MOCK_EVALUATIONS);
}
export function saveEvaluations(data) {
  save(STORAGE_KEYS.EVALUATIONS, data);
}

// ---- アンケート ----
export function loadSurveys() {
  return load(STORAGE_KEYS.SURVEYS, MOCK_SURVEYS);
}
export function saveSurveys(data) {
  save(STORAGE_KEYS.SURVEYS, data);
}

// ---- 戦闘力合計（大学+関連） ----
export function calcObTotal(obCases, studentId, echoTotal) {
  const data = obCases?.[studentId] || {};
  const uni = data.university || {};
  const aff = data.affiliated || {};
  return (uni.ob_vd || 0) + (aff.ob_vd || 0)
    + (uni.ob_inst || 0) + (aff.ob_inst || 0)
    + (uni.ob_cs || 0) + (aff.ob_cs || 0)
    + echoTotal
    + (uni.ob_exam || 0) + (aff.ob_exam || 0);
}

export function calcGynTotal(gynCases, studentId) {
  const data = gynCases?.[studentId] || {};
  let total = 0;
  for (const locKey of ['university', 'affiliated']) {
    const cats = data[locKey] || {};
    for (const catId of Object.keys(cats)) {
      for (const subId of Object.keys(cats[catId] || {})) {
        total += cats[catId][subId] || 0;
      }
    }
  }
  return total;
}

// ---- 病院別集計ヘルパー ----
export function calcHospitalEvalAverages(evaluations, hospitalId) {
  const filtered = evaluations.filter(e => e.hospitalId === hospitalId);
  if (filtered.length === 0) return null;
  const cats = ['teaching', 'feedback', 'environment', 'accessibility', 'overall'];
  const avgs = {};
  for (const c of cats) {
    avgs[c] = +(filtered.reduce((s, e) => s + (e.scores[c] || 0), 0) / filtered.length).toFixed(1);
  }
  return avgs;
}

// ---- 全データリセット ----
export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}
