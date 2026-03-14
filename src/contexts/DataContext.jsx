import { createContext, useContext, useState, useCallback } from 'react';
import {
  loadProgress, saveProgress, updateContentProgress, getLogCount,
  loadPracticeLogs, savePracticeLogs, addLog, deleteLog,
  loadEvaluations, saveEvaluations,
  loadSurveys, saveSurveys,
  loadUsers,
  resetAllData,
} from '../data/store.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users] = useState(() => loadUsers());
  const [progress, setProgress] = useState(() => loadProgress());
  const [practiceLogs, setPracticeLogs] = useState(() => loadPracticeLogs());
  const [evaluations, setEvaluations] = useState(() => loadEvaluations());
  const [surveys, setSurveys] = useState(() => loadSurveys());

  // ---- Progress ----
  const updateProgress = useCallback((studentId, grade, contentId, updates) => {
    setProgress(prev => {
      const next = updateContentProgress(prev, studentId, grade, contentId, updates);
      saveProgress(next);
      return next;
    });
  }, []);

  // ---- Practice Logs ----
  const addPracticeLog = useCallback((studentId, grade, contentId, entry) => {
    setPracticeLogs(prev => {
      const next = addLog(prev, studentId, grade, contentId, entry);
      savePracticeLogs(next);
      // Sync practiceCount to progress
      const count = getLogCount(next, studentId, grade, contentId);
      setProgress(prevP => {
        const nextP = updateContentProgress(prevP, studentId, grade, contentId, { practiceCount: count });
        saveProgress(nextP);
        return nextP;
      });
      return next;
    });
  }, []);

  const deletePracticeLog = useCallback((studentId, grade, contentId, logId) => {
    setPracticeLogs(prev => {
      const next = deleteLog(prev, studentId, grade, contentId, logId);
      savePracticeLogs(next);
      const count = getLogCount(next, studentId, grade, contentId);
      setProgress(prevP => {
        const nextP = updateContentProgress(prevP, studentId, grade, contentId, { practiceCount: count });
        saveProgress(nextP);
        return nextP;
      });
      return next;
    });
  }, []);

  // ---- Evaluations ----
  const addEvaluation = useCallback((evaluation) => {
    setEvaluations(prev => {
      const next = [...prev, { ...evaluation, id: `ev_${Date.now()}`, createdAt: new Date().toISOString() }];
      saveEvaluations(next);
      return next;
    });
  }, []);

  // ---- Surveys ----
  const addSurvey = useCallback((survey) => {
    setSurveys(prev => {
      const next = [...prev, { ...survey, id: `sv_${Date.now()}`, createdAt: new Date().toISOString() }];
      saveSurveys(next);
      return next;
    });
  }, []);

  // ---- Reset ----
  const resetAll = useCallback(() => {
    resetAllData();
    setProgress(loadProgress());
    setPracticeLogs(loadPracticeLogs());
    setEvaluations(loadEvaluations());
    setSurveys(loadSurveys());
  }, []);

  return (
    <DataContext.Provider value={{
      users, progress, practiceLogs, evaluations, surveys,
      updateProgress, addPracticeLog, deletePracticeLog,
      addEvaluation, addSurvey, resetAll,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
