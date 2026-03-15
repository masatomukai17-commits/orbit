import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { GOOD_POINTS, BAD_POINTS, GRADES } from '../../data/constants.js';

export default function SurveyTab() {
  const { currentUser } = useAuth();
  const { surveys, addSurvey } = useData();
  const isM6 = currentUser.grade === GRADES.M6;
  const isResident = currentUser.grade === GRADES.RESIDENT;

  const [form, setForm] = useState({
    satisfaction: 3,
    goodPoints: [],
    badPoints: [],
    badPointsOther: '',
    careerChoice: '',
    recommendToJunior: isM6 || isResident ? 3 : null,
    comment: '',
  });

  const mySurveys = surveys.filter(s => s.studentId === currentUser.id);

  const toggleItem = (field, id) => {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(id) ? p[field].filter(x => x !== id) : [...p[field], id],
    }));
  };

  const handleSubmit = () => {
    if (!form.careerChoice) return;
    addSurvey({
      studentId: currentUser.id,
      grade: currentUser.grade,
      hospitalId: currentUser.hospitalId,
      ...form,
    });
    setForm({
      satisfaction: 3,
      goodPoints: [],
      badPoints: [],
      badPointsOther: '',
      careerChoice: '',
      recommendToJunior: isM6 || isResident ? 3 : null,
      comment: '',
    });
  };

  // Career question varies by grade
  const careerQuestion = isM6
    ? '初期研修医で産婦人科を多めにローテートしたいか'
    : '高次修練で産婦人科を選択したいか';

  const careerOptions = ['100%', '75%', '50%以下'];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">アンケート</h2>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        {/* 実習満足度 */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-2">実習満足度</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n}
                onClick={() => setForm(p => ({ ...p, satisfaction: n }))}
                className={`flex-1 py-2 text-sm rounded ${form.satisfaction >= n ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 良かったこと */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-2">良かったこと（複数選択可）</label>
          <div className="flex flex-wrap gap-1.5">
            {GOOD_POINTS.map(gp => (
              <button key={gp.id}
                onClick={() => toggleItem('goodPoints', gp.id)}
                className={`px-2 py-1 text-[11px] rounded-full ${form.goodPoints.includes(gp.id) ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {gp.label}
              </button>
            ))}
          </div>
        </div>

        {/* 不足に感じたこと */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-2">不足に感じたこと（複数選択可）</label>
          <div className="flex flex-wrap gap-1.5">
            {BAD_POINTS.map(bp => (
              <button key={bp.id}
                onClick={() => toggleItem('badPoints', bp.id)}
                className={`px-2 py-1 text-[11px] rounded-full ${form.badPoints.includes(bp.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {bp.label}
              </button>
            ))}
          </div>
          {form.badPoints.includes('bp7') && (
            <input placeholder="その他の内容を入力" value={form.badPointsOther}
              onChange={e => setForm(p => ({ ...p, badPointsOther: e.target.value }))}
              className="w-full text-xs border rounded px-2 py-1.5 mt-2" />
          )}
        </div>

        {/* キャリア選択 */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-2">{careerQuestion}？</label>
          <div className="flex gap-2">
            {careerOptions.map(opt => (
              <button key={opt}
                onClick={() => setForm(p => ({ ...p, careerChoice: opt }))}
                className={`flex-1 py-2 text-xs rounded ${form.careerChoice === opt ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 後輩に勧めるか（6年生のみ） */}
        {(isM6 || isResident) && (
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-2">産婦人科の実習を後輩に勧めるか（5段階）</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n}
                  onClick={() => setForm(p => ({ ...p, recommendToJunior: n }))}
                  className={`flex-1 py-2 text-sm rounded ${form.recommendToJunior >= n ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* コメント */}
        <textarea placeholder="自由コメント" value={form.comment}
          onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
          className="w-full text-xs border rounded px-2 py-1.5 h-16" />

        <button onClick={handleSubmit}
          className="w-full text-xs bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
          送信
        </button>
      </div>

      {/* Past surveys */}
      {mySurveys.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-2">過去の回答</h3>
          {mySurveys.map(sv => (
            <div key={sv.id} className="border-b border-gray-50 py-2 last:border-0 text-xs">
              <div className="flex justify-between">
                <span>満足度: {sv.satisfaction}/5 | 進路: {sv.careerChoice}</span>
                <span className="text-gray-400">{sv.createdAt?.slice(0, 10)}</span>
              </div>
              {sv.comment && <p className="text-[10px] text-gray-500 mt-1">{sv.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
