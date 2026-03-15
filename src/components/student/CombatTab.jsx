import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { OB_CATEGORIES, GYN_CATEGORIES, GYN_SUB_ITEMS, OB_DISEASES, OB_MATRIX_ROWS, GRADES } from '../../data/constants.js';
import { calcTotalEchoPractice, calcObTotal, calcGynTotal } from '../../data/store.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function CombatTab({ viewStudentId }) {
  const { currentUser } = useAuth();
  const { ladderProgress, obCases, gynCases, obMatrix, updateObCases, updateGynCase, updateObMatrixCell } = useData();
  const sid = viewStudentId || currentUser.id;
  const grade = currentUser.grade;
  const [activeSection, setActiveSection] = useState('ob');
  const [obDetail, setObDetail] = useState(false);
  const [gynDetail, setGynDetail] = useState(null);
  const [matrixFilter, setMatrixFilter] = useState('total');
  const [obInputLoc, setObInputLoc] = useState('university');
  const [gynInputLoc, setGynInputLoc] = useState('university');

  const gradesUsed = grade === GRADES.M6 ? [GRADES.M5, GRADES.M6] : [grade];
  const echoTotal = calcTotalEchoPractice(ladderProgress, sid, gradesUsed);
  const obTotal = calcObTotal(obCases, sid, echoTotal);
  const gynTotal = calcGynTotal(gynCases, sid);

  const obData = obCases[sid] || {};
  const obUni = obData.university || {};
  const obAff = obData.affiliated || {};

  // Radar data for 産科 (大学+関連の合計)
  const obRadarData = OB_CATEGORIES.map(cat => ({
    subject: cat.label,
    value: cat.id === 'ob_echo' ? echoTotal : (obUni[cat.id] || 0) + (obAff[cat.id] || 0),
  }));

  // Radar data for 婦人科 (大学+関連の合計)
  const gynData = gynCases[sid] || {};
  const gynRadarData = GYN_CATEGORIES.map(cat => {
    let total = 0;
    for (const loc of ['university', 'affiliated']) {
      const subs = gynData[loc]?.[cat.id] || {};
      total += Object.values(subs).reduce((s, v) => s + v, 0);
    }
    return { subject: cat.label, value: total };
  });

  // OB Matrix data
  const matrixDataRows = () => {
    const mat = obMatrix[sid] || {};
    return OB_DISEASES.map(dis => {
      const row = { disease: dis.label };
      OB_MATRIX_ROWS.forEach(mr => {
        const cell = mat[dis.id]?.[mr.id] || { university: 0, affiliated: 0 };
        if (matrixFilter === 'university') row[mr.id] = cell.university;
        else if (matrixFilter === 'affiliated') row[mr.id] = cell.affiliated;
        else row[mr.id] = cell.university + cell.affiliated;
      });
      return row;
    });
  };

  const isReadOnly = !!viewStudentId;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">戦闘力</h2>

      {/* 戦闘力サマリー */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setActiveSection('ob')}
          className={`rounded-xl shadow-sm p-4 text-center transition ${activeSection === 'ob' ? 'bg-pink-50 ring-2 ring-pink-500' : 'bg-white'}`}>
          <div className="text-xs text-gray-500">産科戦闘力</div>
          <div className="text-3xl font-bold text-pink-600">{obTotal}</div>
        </button>
        <button onClick={() => setActiveSection('gyn')}
          className={`rounded-xl shadow-sm p-4 text-center transition ${activeSection === 'gyn' ? 'bg-purple-50 ring-2 ring-purple-500' : 'bg-white'}`}>
          <div className="text-xs text-gray-500">婦人科戦闘力</div>
          <div className="text-3xl font-bold text-purple-600">{gynTotal}</div>
        </button>
      </div>

      {/* 産科セクション */}
      {activeSection === 'ob' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">産科レーダー</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={obRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} />
                <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>

            {/* 症例入力 (大学/関連切替) */}
            {!isReadOnly && (
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
                <div className="flex items-center justify-between text-xs bg-blue-50 rounded px-2 py-1.5 mt-2">
                  <span>経腹エコー (Ladder自動)</span>
                  <span className="font-bold text-blue-600">{echoTotal}</span>
                </div>
              </div>
            )}

            {/* 読み取り専用のとき：内訳表示 */}
            {isReadOnly && (
              <div className="mt-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {OB_CATEGORIES.filter(c => c.id !== 'ob_echo').map(cat => (
                    <div key={cat.id} className="text-xs bg-gray-50 rounded px-2 py-1.5">
                      <span className="text-gray-600">{cat.label}</span>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-pink-600">大学{obUni[cat.id] || 0}</span>
                        <span className="text-purple-600">関連{obAff[cat.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs bg-blue-50 rounded px-2 py-1.5 col-span-2">
                    <span>経腹エコー (Ladder自動)</span>
                    <span className="font-bold text-blue-600 ml-2">{echoTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 産科マトリクス */}
          <button onClick={() => setObDetail(!obDetail)}
            className="w-full bg-white rounded-xl shadow-sm p-3 text-sm font-medium text-pink-600 hover:bg-pink-50 transition">
            {obDetail ? '▲ 疾患別マトリクスを閉じる' : '▼ 産科 — 疾患別経験数'}
          </button>

          {obDetail && (
            <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
              <div className="flex gap-2 mb-3">
                {['total', 'university', 'affiliated'].map(f => (
                  <button key={f} onClick={() => setMatrixFilter(f)}
                    className={`px-2 py-1 text-[10px] rounded ${matrixFilter === f ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {f === 'total' ? '合計' : f === 'university' ? '大学のみ' : '関連のみ'}
                  </button>
                ))}
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 px-1">疾患</th>
                    {OB_MATRIX_ROWS.map(r => <th key={r.id} className="text-center py-1 px-1">{r.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrixDataRows().map(row => (
                    <tr key={row.disease} className="border-b border-gray-50">
                      <td className="py-1 px-1 font-medium">{row.disease}</td>
                      {OB_MATRIX_ROWS.map(r => (
                        <td key={r.id} className="text-center py-1 px-1">
                          <span className={row[r.id] > 0 ? 'text-pink-600 font-bold' : 'text-gray-300'}>{row[r.id]}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 婦人科セクション */}
      {activeSection === 'gyn' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">婦人科レーダー</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={gynRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} />
                <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 大学/関連切替 */}
          {!isReadOnly && (
            <div className="flex gap-2">
              <button onClick={() => setGynInputLoc('university')}
                className={`text-xs px-3 py-1 rounded ${gynInputLoc === 'university' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>大学病院</button>
              <button onClick={() => setGynInputLoc('affiliated')}
                className={`text-xs px-3 py-1 rounded ${gynInputLoc === 'affiliated' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>関連病院</button>
            </div>
          )}

          {/* カテゴリ別 */}
          {GYN_CATEGORIES.map(cat => {
            const subs = GYN_SUB_ITEMS[cat.id] || [];
            // 合計値（大学+関連）
            let catTotal = 0;
            for (const loc of ['university', 'affiliated']) {
              const locSubs = gynData[loc]?.[cat.id] || {};
              catTotal += Object.values(locSubs).reduce((s, v) => s + v, 0);
            }
            // 選択中のlocationのデータ
            const locCatData = gynData[gynInputLoc]?.[cat.id] || {};
            const isOpen = gynDetail === cat.id;

            return (
              <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button onClick={() => setGynDetail(isOpen ? null : cat.id)}
                  className="w-full p-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">{catTotal}</span>
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t px-4 pb-4 pt-3">
                    {/* 横棒グラフ（合計） */}
                    <ResponsiveContainer width="100%" height={Math.max(120, subs.length * 30)}>
                      <BarChart data={subs.map(s => {
                        let total = 0;
                        for (const loc of ['university', 'affiliated']) {
                          total += gynData[loc]?.[cat.id]?.[s.id] || 0;
                        }
                        return { name: s.label, count: total };
                      })} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* 入力部分 */}
                    {!isReadOnly ? (
                      <div className="space-y-1 mt-3">
                        {subs.map(s => {
                          const val = locCatData[s.id] || 0;
                          return (
                            <div key={s.id} className="flex items-center justify-between text-[11px]">
                              <span className="text-gray-600 truncate mr-1">{s.label}</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => updateGynCase(sid, gynInputLoc, cat.id, s.id, Math.max(0, val - 1))}
                                  className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]">-</button>
                                <span className="w-6 text-center font-bold text-[11px]">{val}</span>
                                <button onClick={() => updateGynCase(sid, gynInputLoc, cat.id, s.id, val + 1)}
                                  className="w-5 h-5 rounded bg-purple-500 text-white flex items-center justify-center text-[10px]">+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-1 mt-3">
                        {subs.map(s => {
                          const uniVal = gynData.university?.[cat.id]?.[s.id] || 0;
                          const affVal = gynData.affiliated?.[cat.id]?.[s.id] || 0;
                          return (
                            <div key={s.id} className="flex items-center justify-between text-[11px]">
                              <span className="text-gray-600 truncate mr-1">{s.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-pink-600">大学{uniVal}</span>
                                <span className="text-purple-600">関連{affVal}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
