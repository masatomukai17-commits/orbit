import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { ECHO_LADDER, ROLES, GRADES } from '../../data/constants.js';
import { getLadderStep, getLogs, calcLadderCompletion } from '../../data/store.js';

export default function LadderTab({ viewStudentId, viewGrade }) {
  const { currentUser } = useAuth();
  const { ladderProgress, ladderLogs, setLadderStep, addLadderLog, removeLadderLog } = useData();
  const isInstructor = currentUser.role === ROLES.INSTRUCTOR || currentUser.role === ROLES.ADMIN;
  const studentId = viewStudentId || currentUser.id;
  const grade = viewGrade || currentUser.grade;

  const [openItem, setOpenItem] = useState(null);
  const [logForm, setLogForm] = useState({ date: '', supervisor: '', hospitalId: 'h1', caseNote: '' });

  const ladderPct = calcLadderCompletion(ladderProgress, studentId, grade);

  // 5→6年のとき前学年のpracticeも色分け表示
  const prevGrades = grade === GRADES.M6 ? [GRADES.M5] : grade === GRADES.RESIDENT ? [GRADES.M5, GRADES.M6] : [];

  // どのLadderまでアンロックされているか
  const getUnlockIndex = () => {
    for (let i = 0; i < ECHO_LADDER.length; i++) {
      const step = getLadderStep(ladderProgress, studentId, grade, ECHO_LADDER[i].id);
      const prevCount = prevGrades.reduce((sum, pg) => sum + getLadderStep(ladderProgress, studentId, pg, ECHO_LADDER[i].id).practiceCount, 0);
      const totalCount = step.practiceCount + prevCount;
      if (!(step.videoDone && step.quizDone && totalCount >= ECHO_LADDER[i].practiceRequired)) {
        return i;
      }
    }
    return ECHO_LADDER.length; // all done
  };
  const unlockIndex = getUnlockIndex();

  const handleAddLog = (contentId) => {
    if (!logForm.date || !logForm.supervisor) return;
    addLadderLog(studentId, grade, contentId, logForm);
    setLogForm({ date: '', supervisor: '', hospitalId: 'h1', caseNote: '' });
  };

  return (
    <div className="space-y-4">
      {/* 進捗バー */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-gray-800">Echo Ladder</h2>
          <span className="text-pink-600 font-bold">{ladderPct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: `${ladderPct}%` }} />
        </div>
        {/* ステップ進捗表 */}
        <div className="flex gap-2 mt-3">
          {ECHO_LADDER.map((item, i) => {
            const step = getLadderStep(ladderProgress, studentId, grade, item.id);
            const prevCount = prevGrades.reduce((sum, pg) => sum + getLadderStep(ladderProgress, studentId, pg, item.id).practiceCount, 0);
            const totalCount = step.practiceCount + prevCount;
            const done = step.videoDone && step.quizDone && totalCount >= item.practiceRequired;
            return (
              <div key={item.id} className={`flex-1 text-center text-[10px] p-1 rounded ${done ? 'bg-green-100 text-green-700' : i <= unlockIndex ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ladder Cards */}
      {ECHO_LADDER.map((item, idx) => {
        const step = getLadderStep(ladderProgress, studentId, grade, item.id);
        const logs = getLogs(ladderLogs, studentId, grade, item.id);
        const prevCount = prevGrades.reduce((sum, pg) => sum + getLadderStep(ladderProgress, studentId, pg, item.id).practiceCount, 0);
        const totalCount = step.practiceCount + prevCount;
        const done = step.videoDone && step.quizDone && totalCount >= item.practiceRequired;
        const locked = idx > unlockIndex;
        const isOpen = openItem === item.id;

        return (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${locked ? 'opacity-50' : ''}`}>
            <button
              onClick={() => !locked && setOpenItem(isOpen ? null : item.id)}
              className="w-full p-4 flex items-center justify-between text-left"
              disabled={locked}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {done ? '✓' : idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${step.videoDone ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      V{step.videoDone ? '✓' : ''}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${step.quizDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      Q{step.quizDone ? '✓' : ''}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${totalCount >= item.practiceRequired ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                      P {prevCount > 0 && <span className="text-blue-500">{prevCount}</span>}
                      {prevCount > 0 && '+'}
                      <span className={prevCount > 0 ? 'text-red-500' : ''}>{step.practiceCount}</span>
                      /{item.practiceRequired}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t px-4 pb-4 space-y-3">
                {/* V/Q toggles (instructor only) */}
                {isInstructor && (
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => setLadderStep(studentId, grade, item.id, { videoDone: !step.videoDone })}
                      className={`px-3 py-1.5 text-xs rounded-lg ${step.videoDone ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Video {step.videoDone ? '✓' : ''}
                    </button>
                    <button
                      onClick={() => setLadderStep(studentId, grade, item.id, { quizDone: !step.quizDone })}
                      className={`px-3 py-1.5 text-xs rounded-lg ${step.quizDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Quiz {step.quizDone ? '✓' : ''}
                    </button>
                  </div>
                )}

                {/* Practice logs */}
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-2">実技ログ ({totalCount}回)</div>

                  {/* Previous grade logs */}
                  {prevGrades.map(pg => {
                    const prevLogs = getLogs(ladderLogs, studentId, pg, item.id);
                    if (prevLogs.length === 0) return null;
                    return prevLogs.map(log => (
                      <div key={log.id} className="flex items-center gap-2 text-xs py-1 border-b border-gray-50 bg-blue-50 px-2 rounded mb-1">
                        <span className="text-blue-400">{pg}</span>
                        <span className="text-gray-500">{log.date}</span>
                        <span className="text-gray-700 flex-1">{log.caseNote}</span>
                        <span className="text-gray-400">{log.supervisor}</span>
                      </div>
                    ));
                  })}

                  {/* Current grade logs */}
                  {logs.map(log => (
                    <div key={log.id} className="flex items-center gap-2 text-xs py-1 border-b border-gray-50">
                      {prevCount > 0 && <span className="text-red-400">{grade}</span>}
                      <span className="text-gray-500">{log.date}</span>
                      <span className="text-gray-700 flex-1">{log.caseNote}</span>
                      <span className="text-gray-400">{log.supervisor}</span>
                      {isInstructor && (
                        <button onClick={() => removeLadderLog(studentId, grade, item.id, log.id)} className="text-red-400 hover:text-red-600">✕</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add log (instructor for first 5, student after 5) */}
                {(isInstructor || totalCount >= item.practiceRequired) && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-bold text-gray-500">
                      {isInstructor ? 'ログ追加（指導医）' : 'ログ追加（自己記録）'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={logForm.date} onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))}
                        className="text-xs border rounded px-2 py-1" />
                      <input placeholder="指導医名" value={logForm.supervisor} onChange={e => setLogForm(p => ({ ...p, supervisor: e.target.value }))}
                        className="text-xs border rounded px-2 py-1" />
                    </div>
                    <input placeholder="症例メモ" value={logForm.caseNote} onChange={e => setLogForm(p => ({ ...p, caseNote: e.target.value }))}
                      className="w-full text-xs border rounded px-2 py-1" />
                    <button onClick={() => handleAddLog(item.id)}
                      className="w-full text-xs bg-pink-500 text-white py-1.5 rounded-lg hover:bg-pink-600 transition">
                      追加
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
