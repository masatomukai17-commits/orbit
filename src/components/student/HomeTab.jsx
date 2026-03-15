import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { ECHO_LADDER, GRADES, OB_CATEGORIES, GYN_CATEGORIES, GYN_SUB_ITEMS, HOSPITALS } from '../../data/constants.js';
import { getLadderStep, calcLadderCompletion, calcTotalEchoPractice, calcObTotal, calcGynTotal } from '../../data/store.js';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function HomeTab() {
  const { currentUser } = useAuth();
  const { ladderProgress, obCases, gynCases, laparoTimes, updateObCases, updateGynCase } = useData();
  const sid = currentUser.id;
  const grade = currentUser.grade;

  const [showObInput, setShowObInput] = useState(false);
  const [showGynInput, setShowGynInput] = useState(false);
  const [obInputLoc, setObInputLoc] = useState('university'); // university or affiliated

  // Ladder
  const ladderPct = calcLadderCompletion(ladderProgress, sid, grade);
  const currentLadder = ECHO_LADDER.find(item => {
    const step = getLadderStep(ladderProgress, sid, grade, item.id);
    return !(step.videoDone && step.quizDone && step.practiceCount >= item.practiceRequired);
  });

  // 戦闘力
  const gradesUsed = grade === GRADES.M6 ? [GRADES.M5, GRADES.M6] : [grade];
  const echoTotal = calcTotalEchoPractice(ladderProgress, sid, gradesUsed);
  const obTotal = calcObTotal(obCases, sid, echoTotal);
  const gynTotal = calcGynTotal(gynCases, sid);

  // 産科レーダーデータ
  const obData = obCases?.[sid] || {};
  const obUni = obData.university || {};
  const obAff = obData.affiliated || {};
  const obRadarData = OB_CATEGORIES.map(cat => ({
    label: cat.label,
    value: cat.id === 'ob_echo' ? echoTotal : (obUni[cat.id] || 0) + (obAff[cat.id] || 0),
  }));

  // 婦人科レーダーデータ
  const gynData = gynCases?.[sid] || {};
  const gynRadarData = GYN_CATEGORIES.map(cat => {
    let total = 0;
    for (const loc of ['university', 'affiliated']) {
      const subs = gynData[loc]?.[cat.id] || {};
      total += Object.values(subs).reduce((s, v) => s + v, 0);
    }
    return { label: cat.label, value: total };
  });

  // ラパロタイム折れ線
  const times = (laparoTimes[sid] || []).sort((a, b) => a.date.localeCompare(b.date));
  const laparoChartData = times.map((t, i) => ({
    name: `${i + 1}`,
    seconds: t.seconds,
    date: t.date,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">ホーム</h2>

      {/* Echo Ladder サマリー */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-700">Echo Ladder</h3>
          <span className="text-pink-600 font-bold text-lg">{ladderPct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: `${ladderPct}%` }} />
        </div>
        {currentLadder ? (
          <p className="text-xs text-gray-500">現在: {currentLadder.title}</p>
        ) : (
          <p className="text-xs text-green-600 font-medium">全Ladder完了!</p>
        )}
      </div>

      {/* 戦闘力 — 産科 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-700">産科戦闘力</h3>
          <span className="text-2xl font-bold text-pink-600">{obTotal}</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={obRadarData} outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
        <button onClick={() => setShowObInput(!showObInput)}
          className="w-full text-xs text-pink-500 border border-pink-200 rounded-lg py-1.5 hover:bg-pink-50 transition mt-1">
          経験した症例（大学病院 / 関連病院）
        </button>
        {showObInput && (
          <div className="mt-3 border-t pt-3">
            <div className="flex gap-2 mb-2">
              <button onClick={() => setObInputLoc('university')}
                className={`text-xs px-3 py-1 rounded ${obInputLoc === 'university' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>大学病院</button>
              <button onClick={() => setObInputLoc('affiliated')}
                className={`text-xs px-3 py-1 rounded ${obInputLoc === 'affiliated' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>関連病院</button>
            </div>
            <div className="space-y-1">
              {OB_CATEGORIES.filter(c => c.id !== 'ob_echo').map(cat => {
                const locData = obData[obInputLoc] || {};
                const val = locData[cat.id] || 0;
                return (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">{cat.label}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateObCases(sid, obInputLoc, cat.id, Math.max(0, val - 1))}
                        className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center">-</button>
                      <span className="w-8 text-center font-bold">{val}</span>
                      <button onClick={() => updateObCases(sid, obInputLoc, cat.id, val + 1)}
                        className="w-6 h-6 rounded bg-pink-500 text-white flex items-center justify-center">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 戦闘力 — 婦人科 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-700">婦人科戦闘力</h3>
          <span className="text-2xl font-bold text-purple-600">{gynTotal}</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={gynRadarData} outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
        <button onClick={() => setShowGynInput(!showGynInput)}
          className="w-full text-xs text-purple-500 border border-purple-200 rounded-lg py-1.5 hover:bg-purple-50 transition mt-1">
          経験した症例（大学病院 / 関連病院）
        </button>
        {showGynInput && (
          <GynCaseInput gynCases={gynCases} sid={sid} updateGynCase={updateGynCase} />
        )}
      </div>

      {/* ラパロタイム折れ線 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-bold text-sm text-gray-700 mb-2">ラパロタイム（結紮）</h3>
        {times.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={laparoChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} label={{ value: '回', position: 'insideBottomRight', fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} unit="秒" />
                <Tooltip formatter={(v) => [`${v}秒`, 'タイム']}
                  labelFormatter={(l) => { const d = laparoChartData.find(c => c.name === l); return d ? d.date : l; }} />
                <Line type="monotone" dataKey="seconds" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs text-gray-500 mt-1">
              <span>ベスト: <strong className="text-pink-600">{Math.min(...times.map(t => t.seconds))}秒</strong></span>
              <span>平均: <strong>{Math.round(times.reduce((s, t) => s + t.seconds, 0) / times.length)}秒</strong></span>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400">記録なし</p>
        )}
      </div>
    </div>
  );
}

// 婦人科症例入力サブコンポーネント
function GynCaseInput({ gynCases, sid, updateGynCase }) {
  const [gynInputLoc, setGynInputLoc] = useState('university');
  const gynData = gynCases?.[sid] || {};

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setGynInputLoc('university')}
          className={`text-xs px-3 py-1 rounded ${gynInputLoc === 'university' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>大学病院</button>
        <button onClick={() => setGynInputLoc('affiliated')}
          className={`text-xs px-3 py-1 rounded ${gynInputLoc === 'affiliated' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>関連病院</button>
      </div>
      <div className="space-y-3">
        {GYN_CATEGORIES.map(cat => {
          const subs = GYN_SUB_ITEMS[cat.id] || [];
          return (
            <div key={cat.id}>
              <div className="text-xs font-medium text-gray-600 mb-1">{cat.label}</div>
              <div className="space-y-0.5 pl-2">
                {subs.map(sub => {
                  const val = gynData[gynInputLoc]?.[cat.id]?.[sub.id] || 0;
                  return (
                    <div key={sub.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-600">{sub.label}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateGynCase(sid, gynInputLoc, cat.id, sub.id, Math.max(0, val - 1))}
                          className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]">-</button>
                        <span className="w-6 text-center font-bold text-[11px]">{val}</span>
                        <button onClick={() => updateGynCase(sid, gynInputLoc, cat.id, sub.id, val + 1)}
                          className="w-5 h-5 rounded bg-purple-500 text-white flex items-center justify-center text-[10px]">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
