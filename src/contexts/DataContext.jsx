import { createContext, useContext, useState, useCallback } from 'react';
import {
  loadLadderProgress, saveLadderProgress,
  loadLadderLogs, saveLadderLogs,
  loadObCases, saveObCases,
  loadGynCases, saveGynCases,
  loadObMatrix, saveObMatrix,
  loadLaparoTimes, saveLaparoTimes,
  loadEvaluations, saveEvaluations,
  loadSurveys, saveSurveys,
  loadUsers, saveUsers,
  updateLadderStep, addLog, deleteLog,
} from '../data/store.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [ladderProgress, setLadderProgress] = useState(loadLadderProgress);
  const [ladderLogs, setLadderLogs] = useState(loadLadderLogs);
  const [obCases, setObCases] = useState(loadObCases);
  const [gynCases, setGynCases] = useState(loadGynCases);
  const [obMatrix, setObMatrix] = useState(loadObMatrix);
  const [laparoTimes, setLaparoTimes] = useState(loadLaparoTimes);
  const [evaluations, setEvaluations] = useState(loadEvaluations);
  const [surveys, setSurveys] = useState(loadSurveys);
  const [users, setUsers] = useState(loadUsers);

  // -- Ladder --
  const setLadderStep = useCallback((studentId, grade, contentId, updates) => {
    setLadderProgress(prev => {
      const next = updateLadderStep(prev, studentId, grade, contentId, updates);
      saveLadderProgress(next);
      return next;
    });
  }, []);

  const addLadderLog = useCallback((studentId, grade, contentId, entry) => {
    setLadderLogs(prev => {
      const next = addLog(prev, studentId, grade, contentId, entry);
      saveLadderLogs(next);
      return next;
    });
    // Sync practice count
    setLadderProgress(prev => {
      const logs = addLog(ladderLogs, studentId, grade, contentId, entry);
      const count = (logs?.[studentId]?.[grade]?.[contentId] || []).length;
      const next = updateLadderStep(prev, studentId, grade, contentId, { practiceCount: count });
      saveLadderProgress(next);
      return next;
    });
  }, [ladderLogs]);

  const removeLadderLog = useCallback((studentId, grade, contentId, logId) => {
    setLadderLogs(prev => {
      const next = deleteLog(prev, studentId, grade, contentId, logId);
      saveLadderLogs(next);
      // Sync practice count
      const count = (next?.[studentId]?.[grade]?.[contentId] || []).length;
      setLadderProgress(p => {
        const np = updateLadderStep(p, studentId, grade, contentId, { practiceCount: count });
        saveLadderProgress(np);
        return np;
      });
      return next;
    });
  }, []);

  // -- OB Cases (大学/関連別) --
  // updateObCases(studentId, location, catId, value)
  // location = 'university' | 'affiliated'
  const updateObCases = useCallback((studentId, location, catId, value) => {
    setObCases(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[studentId]) next[studentId] = {};
      if (!next[studentId][location]) next[studentId][location] = {};
      next[studentId][location][catId] = value;
      saveObCases(next);
      return next;
    });
  }, []);

  // -- GYN Cases (大学/関連別) --
  // updateGynCase(studentId, location, catId, subId, count)
  const updateGynCase = useCallback((studentId, location, catId, subId, count) => {
    setGynCases(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[studentId]) next[studentId] = {};
      if (!next[studentId][location]) next[studentId][location] = {};
      if (!next[studentId][location][catId]) next[studentId][location][catId] = {};
      next[studentId][location][catId][subId] = count;
      saveGynCases(next);
      return next;
    });
  }, []);

  // -- OB Matrix --
  const updateObMatrixCell = useCallback((studentId, diseaseId, rowId, type, count) => {
    setObMatrix(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[studentId]) next[studentId] = {};
      if (!next[studentId][diseaseId]) next[studentId][diseaseId] = {};
      if (!next[studentId][diseaseId][rowId]) next[studentId][diseaseId][rowId] = { university: 0, affiliated: 0 };
      next[studentId][diseaseId][rowId][type] = count;
      saveObMatrix(next);
      return next;
    });
  }, []);

  // -- Laparo Times --
  const addLaparoTime = useCallback((studentId, entry) => {
    setLaparoTimes(prev => {
      const next = { ...prev };
      if (!next[studentId]) next[studentId] = [];
      next[studentId] = [...next[studentId], { ...entry, id: `lt_${Date.now()}` }];
      saveLaparoTimes(next);
      return next;
    });
  }, []);

  // -- Evaluations --
  const addEvaluation = useCallback((entry) => {
    setEvaluations(prev => {
      const next = [...prev, { ...entry, id: `ev_${Date.now()}`, createdAt: new Date().toISOString() }];
      saveEvaluations(next);
      return next;
    });
  }, []);

  // -- Surveys --
  const addSurvey = useCallback((entry) => {
    setSurveys(prev => {
      const next = [...prev, { ...entry, id: `sv_${Date.now()}`, createdAt: new Date().toISOString() }];
      saveSurveys(next);
      return next;
    });
  }, []);

  // -- Users --
  const updateUser = useCallback((userId, updates) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === userId ? { ...u, ...updates } : u);
      saveUsers(next);
      return next;
    });
  }, []);

  const addUser = useCallback((user) => {
    setUsers(prev => {
      const next = [...prev, user];
      saveUsers(next);
      return next;
    });
  }, []);

  return (
    <DataContext.Provider value={{
      ladderProgress, ladderLogs, obCases, gynCases, obMatrix, laparoTimes, evaluations, surveys, users,
      setLadderStep, addLadderLog, removeLadderLog,
      updateObCases, updateGynCase, updateObMatrixCell,
      addLaparoTime, addEvaluation, addSurvey,
      updateUser, addUser,
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
