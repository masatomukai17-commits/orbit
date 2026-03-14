import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { INFLUENCE_FACTORS, ALL_CONTENTS, HOSPITALS } from '../data/constants.js';

export default function SurveyForm() {
  const { currentUser } = useAuth();
  const { addSurvey, surveys } = useData();
  const [submitted, setSubmitted] = useState(false);

  const [chooseObgyn, setChooseObgyn] = useState('');
  const [factors, setFactors] = useState([]);
  const [mostValuable, setMostValuable] = useState('');
  const [npsScore, setNpsScore] = useState(0);
  const [comment, setComment] = useState('');

  const toggleFactor = (fId) => {
    setFactors(prev => prev.includes(fId) ? prev.filter(f => f !== fId) : [...prev, fId]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chooseObgyn || npsScore === 0) return;
    addSurvey({
      studentId: currentUser.id,
      grade: currentUser.grade,
      hospitalId: currentUser.hospitalId,
      chooseObgyn,
      influenceFactors: factors,
      mostValuableContent: mostValuable || null,
      npsScore,
      comment,
    });
    setSubmitted(true);
  };

  const mySurveys = surveys.filter(s => s.studentId === currentUser.id);

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">アンケートを送信しました</h2>
        <p className="text-gray-500">回答は産婦人科教育の改善・研究に活用されます。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800">産婦人科実習アンケート</h2>
        <p className="text-sm text-gray-500 mt-1">回答は匿名で処理され、教育研究に使用されます。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Q1: Choose OB/GYN */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-3">Q1. 産婦人科を将来の進路として考えていますか？</h3>
          <div className="flex gap-2">
            {[
              { value: 'yes', label: 'はい', color: 'bg-green-500' },
              { value: 'undecided', label: '検討中', color: 'bg-yellow-500' },
              { value: 'no', label: 'いいえ', color: 'bg-gray-400' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setChooseObgyn(opt.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                  chooseObgyn === opt.value ? `${opt.color} text-white shadow-sm` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Influence factors */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-1">Q2. 進路選択に影響する因子は？（複数選択可）</h3>
          <p className="text-xs text-gray-400 mb-3">当てはまるものを全て選んでください</p>
          <div className="flex flex-wrap gap-2">
            {INFLUENCE_FACTORS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFactor(f.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  factors.includes(f.id) ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Most valuable content */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-2">Q3. 最も印象に残った実習コンテンツは？</h3>
          <select value={mostValuable} onChange={e => setMostValuable(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm">
            <option value="">選択してください</option>
            {ALL_CONTENTS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        {/* Q4: NPS */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-1">Q4. 産婦人科の実習を後輩に勧めますか？</h3>
          <p className="text-xs text-gray-400 mb-3">0（全く勧めない）〜 10（強く勧める）</p>
          <div className="flex gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNpsScore(i)}
                className={`flex-1 py-2 rounded text-xs font-medium transition ${
                  npsScore === i
                    ? i >= 9 ? 'bg-green-500 text-white' : i >= 7 ? 'bg-yellow-500 text-white' : 'bg-red-400 text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">自由コメント（任意）</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="実習についての感想、産婦人科に対するイメージの変化など..."
            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!chooseObgyn || npsScore === 0}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl disabled:opacity-40 transition shadow-lg"
        >
          送信
        </button>
      </form>
    </div>
  );
}
