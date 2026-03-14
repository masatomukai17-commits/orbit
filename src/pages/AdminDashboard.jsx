import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { HOSPITALS, ECHO_CONTENTS, TECHNIQUE_CONTENTS, ALL_CONTENTS, GRADE_LABELS, INFLUENCE_FACTORS, EVALUATION_CATEGORIES } from '../data/constants.js';
import { getContentProgress, getLogs, calcCompletionRate, calcHospitalAverages } from '../data/store.js';
import Header from '../components/Header.jsx';

export default function AdminDashboard() {
  const { users, progress, practiceLogs, evaluations, surveys, resetAll } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '全体概要', icon: '📊' },
    { id: 'hospitals', label: '病院比較', icon: '🏥' },
    { id: 'survey', label: 'アンケート', icon: '📝' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ];

  const students = users.filter(u => u.role === 'student');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'overview' && <OverviewTab students={students} progress={progress} practiceLogs={practiceLogs} evaluations={evaluations} surveys={surveys} />}
        {activeTab === 'hospitals' && <HospitalTab students={students} progress={progress} evaluations={evaluations} />}
        {activeTab === 'survey' && <SurveyTab surveys={surveys} />}
        {activeTab === 'settings' && <SettingsTab resetAll={resetAll} />}
      </main>
    </div>
  );
}

// ---- Overview ----
function OverviewTab({ students, progress, practiceLogs, evaluations, surveys }) {
  const totalStudents = students.length;
  const gradeBreakdown = {};
  students.forEach(s => { gradeBreakdown[s.grade] = (gradeBreakdown[s.grade] || 0) + 1; });

  const avgCompletion = students.length > 0
    ? students.reduce((sum, s) => sum + calcCompletionRate(progress, s.id, s.grade, ALL_CONTENTS), 0) / students.length
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="総学生数" value={totalStudents} sub={Object.entries(gradeBreakdown).map(([g, n]) => `${GRADE_LABELS[g]}:${n}`).join(' / ')} color="pink" />
        <KpiCard label="平均達成率" value={`${Math.round(avgCompletion * 100)}%`} sub="全コンテンツ" color="purple" />
        <KpiCard label="逆評定数" value={evaluations.length} sub="匿名フィードバック" color="blue" />
        <KpiCard label="アンケート数" value={surveys.length} sub="進路調査" color="green" />
      </div>

      {/* Student list */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">学生一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs">
                <th className="text-left py-2 px-2">名前</th>
                <th className="text-left py-2 px-2">学年</th>
                <th className="text-left py-2 px-2">病院</th>
                <th className="text-left py-2 px-2">Echo達成</th>
                <th className="text-left py-2 px-2">Tech達成</th>
                <th className="text-left py-2 px-2">総合</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const echoRate = calcCompletionRate(progress, s.id, s.grade, ECHO_CONTENTS);
                const techRate = calcCompletionRate(progress, s.id, s.grade, TECHNIQUE_CONTENTS);
                const totalRate = calcCompletionRate(progress, s.id, s.grade, ALL_CONTENTS);
                const hospital = HOSPITALS.find(h => h.id === s.hospitalId);
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium">{s.name}</td>
                    <td className="py-2 px-2 text-gray-500">{GRADE_LABELS[s.grade]}</td>
                    <td className="py-2 px-2 text-gray-500">{hospital?.shortName}</td>
                    <td className="py-2 px-2"><ProgressBar value={echoRate} /></td>
                    <td className="py-2 px-2"><ProgressBar value={techRate} /></td>
                    <td className="py-2 px-2"><ProgressBar value={totalRate} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Hospital Comparison ----
function HospitalTab({ students, progress, evaluations }) {
  const hospitalData = HOSPITALS.map(h => {
    const hStudents = students.filter(s => s.hospitalId === h.id);
    const avgCompletion = hStudents.length > 0
      ? hStudents.reduce((sum, s) => sum + calcCompletionRate(progress, s.id, s.grade, ALL_CONTENTS), 0) / hStudents.length
      : 0;
    const evalAvg = calcHospitalAverages(evaluations, h.id);
    return { ...h, studentCount: hStudents.length, avgCompletion, evalAvg };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800">病院間比較</h2>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitalData.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{h.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${h.type === 'university' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {h.type === 'university' ? '大学' : '関連'}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">学生数</span>
                  <span className="font-bold">{h.studentCount}名</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">平均達成率</span>
                  <span className="font-bold">{Math.round(h.avgCompletion * 100)}%</span>
                </div>
                <ProgressBar value={h.avgCompletion} />
              </div>
              {h.evalAvg && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">逆評定 総合</span>
                    <span className="font-bold text-pink-600">{h.evalAvg.overall.toFixed(1)}/5</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {['teaching', 'feedback', 'environment', 'accessibility'].map(cat => {
                      const labels = { teaching: '教え方', feedback: 'FB', environment: '環境', accessibility: '質問' };
                      return (
                        <div key={cat} className="text-center">
                          <div className="text-sm font-bold text-gray-700">{h.evalAvg[cat].toFixed(1)}</div>
                          <div className="text-[10px] text-gray-400">{labels[cat]}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">回答数: {h.evalAvg.count}件</div>
                </div>
              )}
              {!h.evalAvg && (
                <div className="text-xs text-gray-400">逆評定データなし</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ranking */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3">逆評定ランキング（総合スコア）</h3>
        <div className="space-y-2">
          {hospitalData
            .filter(h => h.evalAvg)
            .sort((a, b) => b.evalAvg.overall - a.evalAvg.overall)
            .map((h, i) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</span>
                <span className="font-medium text-gray-700 flex-1">{h.name}</span>
                <span className="text-pink-600 font-bold">{h.evalAvg.overall.toFixed(1)}</span>
                <div className="w-32"><ProgressBar value={h.evalAvg.overall / 5} /></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---- Survey Results ----
function SurveyTab({ surveys }) {
  if (surveys.length === 0) {
    return <div className="text-center text-gray-400 py-12">アンケートデータがありません</div>;
  }

  // Choice breakdown
  const choiceCounts = { yes: 0, undecided: 0, no: 0 };
  surveys.forEach(s => { choiceCounts[s.chooseObgyn] = (choiceCounts[s.chooseObgyn] || 0) + 1; });

  // Factor frequency
  const factorCounts = {};
  INFLUENCE_FACTORS.forEach(f => { factorCounts[f.id] = 0; });
  surveys.forEach(s => { s.influenceFactors.forEach(fId => { factorCounts[fId] = (factorCounts[fId] || 0) + 1; }); });
  const sortedFactors = INFLUENCE_FACTORS
    .map(f => ({ ...f, count: factorCounts[f.id] }))
    .sort((a, b) => b.count - a.count);

  // NPS
  const avgNps = surveys.reduce((s, sv) => s + sv.npsScore, 0) / surveys.length;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800">アンケート集計（{surveys.length}件）</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Choice breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-700 mb-3">産婦人科志望</h3>
          <div className="space-y-2">
            {[
              { key: 'yes', label: 'はい', color: 'bg-green-500' },
              { key: 'undecided', label: '検討中', color: 'bg-yellow-500' },
              { key: 'no', label: 'いいえ', color: 'bg-gray-400' },
            ].map(opt => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-12">{opt.label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${opt.color} rounded-full transition-all`} style={{ width: `${(choiceCounts[opt.key] / surveys.length) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{choiceCounts[opt.key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NPS */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center">
          <h3 className="font-bold text-gray-700 mb-2">推奨スコア (NPS)</h3>
          <div className="text-5xl font-bold text-pink-600">{avgNps.toFixed(1)}</div>
          <div className="text-sm text-gray-400">/10</div>
        </div>

        {/* Factor ranking */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-700 mb-3">影響因子 TOP5</h3>
          <div className="space-y-2">
            {sortedFactors.slice(0, 5).map((f, i) => (
              <div key={f.id} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                <span className="text-sm text-gray-700 flex-1">{f.label}</span>
                <div className="w-20 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full" style={{ width: `${(f.count / surveys.length) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-6 text-right">{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">自由コメント</h3>
        <div className="space-y-2">
          {surveys.filter(s => s.comment).map(s => (
            <div key={s.id} className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-600">"{s.comment}"</p>
              <div className="text-xs text-gray-400 mt-1">
                {GRADE_LABELS[s.grade]} / {s.chooseObgyn === 'yes' ? '志望' : s.chooseObgyn === 'undecided' ? '検討中' : '他科志望'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Settings ----
function SettingsTab({ resetAll }) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800">設定</h2>
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-red-600 mb-2">データリセット</h3>
        <p className="text-sm text-gray-500 mb-3">全データを初期状態（デモデータ）に戻します。本番環境では使用しないでください。</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm">リセット</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { resetAll(); setConfirmReset(false); }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">本当にリセット</button>
            <button onClick={() => setConfirmReset(false)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">取消</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-2">エクスポート（今後実装）</h3>
        <p className="text-sm text-gray-500">CSV/Excel形式でのデータエクスポートは今後実装予定です。</p>
        <button disabled className="mt-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed">CSVエクスポート（準備中）</button>
      </div>
    </div>
  );
}

// ---- Shared Components ----
function KpiCard({ label, value, sub, color }) {
  const colors = {
    pink: 'from-pink-500 to-pink-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white shadow-md`}>
      <p className="text-white/70 text-xs">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-white/60 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

function ProgressBar({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : pct > 0 ? 'bg-pink-400' : 'bg-gray-200'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}
