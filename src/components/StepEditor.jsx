import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { getContentProgress, getLogs } from '../data/store.js';
import { ROLES, HOSPITALS } from '../data/constants.js';

export default function StepEditor({ content, studentId, grade, onClose }) {
  const { currentUser } = useAuth();
  const { progress, practiceLogs, updateProgress, addPracticeLog, deletePracticeLog } = useData();
  const isTeacher = currentUser.role === ROLES.INSTRUCTOR || currentUser.role === ROLES.ADMIN;

  const p = getContentProgress(progress, studentId, grade, content.id);
  const logs = getLogs(practiceLogs, studentId, grade, content.id);
  const pCount = logs.length || p.practiceCount;
  const isComplete = p.videoDone && p.quizDone && pCount >= content.step3Required;

  // Log form state
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logSupervisor, setLogSupervisor] = useState(currentUser.name);
  const [logHospital, setLogHospital] = useState(currentUser.hospitalId || 'h1');
  const [logNote, setLogNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (field) => {
    if (!isTeacher) return;
    updateProgress(studentId, grade, content.id, { [field]: !p[field] });
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logDate || !logSupervisor) return;
    addPracticeLog(studentId, grade, content.id, {
      date: logDate,
      supervisor: logSupervisor,
      hospitalId: logHospital,
      caseNote: logNote,
    });
    setLogNote('');
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-5 rounded-t-2xl ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-pink-500 to-purple-600'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{content.title}</h2>
              <p className="text-white/70 text-sm mt-0.5">{content.description}</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1: Video */}
          <StepRow
            number={1}
            label="動画視聴"
            done={p.videoDone}
            canToggle={isTeacher}
            onToggle={() => handleToggle('videoDone')}
          />

          {/* Step 2: Quiz */}
          <StepRow
            number={2}
            label="小テスト"
            done={p.quizDone}
            canToggle={isTeacher}
            onToggle={() => handleToggle('quizDone')}
            locked={!p.videoDone}
          />

          {/* Step 3: Practice */}
          <div className={`rounded-xl border-2 p-4 ${pCount >= content.step3Required ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold">3</span>
                <span className="font-medium text-gray-800">実技練習</span>
              </div>
              <span className={`text-sm font-bold ${pCount >= content.step3Required ? 'text-green-600' : 'text-gray-500'}`}>
                {pCount} / {content.step3Required}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (pCount / content.step3Required) * 100)}%` }}
              />
            </div>

            {/* Log list */}
            {logs.length > 0 && (
              <div className="space-y-2 mb-3">
                {logs.map((log, i) => (
                  <div key={log.id} className="flex items-start justify-between bg-white rounded-lg p-2.5 border border-gray-100 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">#{i + 1}</span>
                      <span className="text-gray-600 ml-2">{log.date}</span>
                      <span className="text-gray-400 mx-1.5">|</span>
                      <span className="text-gray-600">{log.supervisor}</span>
                      {log.caseNote && <p className="text-gray-500 text-xs mt-0.5">{log.caseNote}</p>}
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => deletePracticeLog(studentId, grade, content.id, log.id)}
                        className="text-red-400 hover:text-red-600 text-xs ml-2 shrink-0"
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add log */}
            {isTeacher && (
              <>
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-2 text-sm text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition"
                  >
                    ＋ ログ追加
                  </button>
                ) : (
                  <form onSubmit={handleAddLog} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} className="px-2 py-1.5 border rounded-lg text-sm" required />
                      <input type="text" value={logSupervisor} onChange={e => setLogSupervisor(e.target.value)} placeholder="指導者" className="px-2 py-1.5 border rounded-lg text-sm" required />
                    </div>
                    <select value={logHospital} onChange={e => setLogHospital(e.target.value)} className="w-full px-2 py-1.5 border rounded-lg text-sm">
                      {HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                    <input type="text" value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="症例メモ（任意）" className="w-full px-2 py-1.5 border rounded-lg text-sm" />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600">追加</button>
                      <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-gray-500 text-sm border rounded-lg hover:bg-gray-100">取消</button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRow({ number, label, done, canToggle, onToggle, locked }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition ${
      done ? 'border-green-300 bg-green-50' : locked ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold">{number}</span>
        <span className="font-medium text-gray-800">{label}</span>
      </div>
      <button
        onClick={canToggle && !locked ? onToggle : undefined}
        disabled={!canToggle || locked}
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
          done ? 'bg-green-500 text-white' :
          canToggle && !locked ? 'bg-gray-200 hover:bg-gray-300 text-gray-400 cursor-pointer' :
          'bg-gray-100 text-gray-300'
        }`}
      >
        {done ? '✓' : '·'}
      </button>
    </div>
  );
}
