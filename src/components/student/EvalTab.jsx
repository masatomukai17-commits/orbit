import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { HOSPITALS, EVALUATION_CATEGORIES } from '../../data/constants.js';

export default function EvalTab() {
  const { currentUser } = useAuth();
  const { evaluations, addEvaluation } = useData();

  const [form, setForm] = useState({
    hospitalId: currentUser.hospitalId || 'h1',
    rotationPeriod: '',
    scores: { teaching: 3, feedback: 3, environment: 3, accessibility: 3, overall: 3 },
    enthusiasticTeacher: '',
    comment: '',
  });

  const myEvals = evaluations.filter(e => e.studentId === currentUser.id);

  const handleSubmit = () => {
    if (!form.rotationPeriod) return;
    addEvaluation({
      studentId: currentUser.id,
      grade: currentUser.grade,
      ...form,
    });
    setForm({
      hospitalId: currentUser.hospitalId || 'h1',
      rotationPeriod: '',
      scores: { teaching: 3, feedback: 3, environment: 3, accessibility: 3, overall: 3 },
      enthusiasticTeacher: '',
      comment: '',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">逆評定</h2>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-sm text-gray-700">新規評価</h3>

        <div className="grid grid-cols-2 gap-2">
          <select value={form.hospitalId} onChange={e => setForm(p => ({ ...p, hospitalId: e.target.value }))}
            className="text-xs border rounded px-2 py-1.5">
            {HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <input placeholder="ローテ期間 (例: 2026年1月)" value={form.rotationPeriod}
            onChange={e => setForm(p => ({ ...p, rotationPeriod: e.target.value }))}
            className="text-xs border rounded px-2 py-1.5" />
        </div>

        {/* Scores */}
        {EVALUATION_CATEGORIES.map(cat => (
          <div key={cat.id} className="flex items-center justify-between">
            <span className="text-xs text-gray-700">{cat.label}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n}
                  onClick={() => setForm(p => ({ ...p, scores: { ...p.scores, [cat.id]: n } }))}
                  className={`w-7 h-7 text-xs rounded ${form.scores[cat.id] >= n ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 熱心に指導してくれた先生名 */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">熱心に指導してくれた先生名</label>
          <input value={form.enthusiasticTeacher}
            onChange={e => setForm(p => ({ ...p, enthusiasticTeacher: e.target.value }))}
            placeholder="先生の名前"
            className="w-full text-xs border rounded px-2 py-1.5" />
        </div>

        <textarea placeholder="コメント（自由記載）" value={form.comment}
          onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
          className="w-full text-xs border rounded px-2 py-1.5 h-16" />

        <button onClick={handleSubmit}
          className="w-full text-xs bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition">
          送信
        </button>
      </div>

      {/* Past evaluations */}
      {myEvals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-2">過去の評価</h3>
          {myEvals.map(ev => {
            const hosp = HOSPITALS.find(h => h.id === ev.hospitalId);
            return (
              <div key={ev.id} className="border-b border-gray-50 py-2 last:border-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{hosp?.name} — {ev.rotationPeriod}</span>
                  <span className="text-gray-400">{ev.scores.overall}/5</span>
                </div>
                {ev.enthusiasticTeacher && (
                  <div className="text-[10px] text-pink-500 mt-0.5">熱心な先生: {ev.enthusiasticTeacher}</div>
                )}
                {ev.comment && <p className="text-[10px] text-gray-500 mt-0.5">{ev.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
