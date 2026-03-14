import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { EVALUATION_CATEGORIES, HOSPITALS } from '../data/constants.js';

export default function EvaluationForm() {
  const { currentUser } = useAuth();
  const { addEvaluation, evaluations } = useData();
  const [submitted, setSubmitted] = useState(false);

  const [hospitalId, setHospitalId] = useState(currentUser.hospitalId || 'h1');
  const [period, setPeriod] = useState('2026年3月');
  const [scores, setScores] = useState(
    Object.fromEntries(EVALUATION_CATEGORIES.map(c => [c.id, 0]))
  );
  const [comment, setComment] = useState('');

  const setScore = (catId, value) => {
    setScores(prev => ({ ...prev, [catId]: value }));
  };

  const allScored = Object.values(scores).every(s => s > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allScored) return;
    addEvaluation({
      studentId: currentUser.id,
      grade: currentUser.grade,
      hospitalId,
      rotationPeriod: period,
      instructorId: null,
      scores,
      comment,
    });
    setSubmitted(true);
  };

  // Already submitted evaluations
  const myEvals = evaluations.filter(e => e.studentId === currentUser.id);

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">評価を送信しました</h2>
        <p className="text-gray-500">ご協力ありがとうございます。フィードバックは教育改善に活用されます。</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">もう一件入力</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800">逆評定 — 実習の評価</h2>
        <p className="text-sm text-gray-500 mt-1">匿名で処理されます。率直なフィードバックをお願いします。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hospital & Period */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">実習病院</label>
            <select value={hospitalId} onChange={e => setHospitalId(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm">
              {HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ローテ期間</label>
            <input type="text" value={period} onChange={e => setPeriod(e.target.value)} placeholder="例: 2026年3月" className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
        </div>

        {/* Rating categories */}
        {EVALUATION_CATEGORIES.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{cat.label}</h3>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </div>
              {scores[cat.id] > 0 && (
                <span className="text-sm font-bold text-pink-600">{scores[cat.id]}/5</span>
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setScore(cat.id, v)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    scores[cat.id] >= v
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Free comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">自由コメント（任意）</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="実習で良かった点、改善してほしい点など..."
            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!allScored}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 transition shadow-lg"
        >
          評価を送信
        </button>
      </form>

      {/* Past evaluations */}
      {myEvals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-2">過去の評価 ({myEvals.length}件)</h3>
          <div className="space-y-2">
            {myEvals.map(ev => {
              const hospital = HOSPITALS.find(h => h.id === ev.hospitalId);
              return (
                <div key={ev.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <span className="font-medium">{hospital?.shortName}</span>
                  <span className="text-gray-400 ml-2">{ev.rotationPeriod}</span>
                  <span className="text-pink-600 ml-2 font-bold">総合 {ev.scores.overall}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
