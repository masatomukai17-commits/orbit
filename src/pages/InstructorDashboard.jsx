import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { INSTRUCTOR_TABS, GRADES, GRADE_LABELS, HOSPITALS, ECHO_LADDER, EVALUATION_CATEGORIES, OB_CATEGORIES, GYN_CATEGORIES, GYN_SUB_ITEMS } from '../data/constants.js';
import { calcLadderCompletion, calcTotalEchoPractice, calcObTotal, calcGynTotal, calcHospitalEvalAverages } from '../data/store.js';
import Header from '../components/Header.jsx';
import LadderTab from '../components/student/LadderTab.jsx';
import CombatTab from '../components/student/CombatTab.jsx';
import LaparoTab from '../components/student/LaparoTab.jsx';

export default function InstructorDashboard() {
  const { currentUser } = useAuth();
  const { users, ladderProgress, obCases, gynCases, laparoTimes, evaluations, surveys, updateUser } = useData();
  const [activeTab, setActiveTab] = useState('students');
  const [viewStudent, setViewStudent] = useState(null);
  const [studentTab, setStudentTab] = useState('ladder');
  const [editUser, setEditUser] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('M5'); // M5 or M6
  const [showMode, setShowMode] = useState('current'); // current or all

  const students = users.filter(u => u.role === 'student' && u.grade !== GRADES.RESIDENT);

  const getStudentStats = (s) => {
    const gradesUsed = s.grade === GRADES.M6 ? [GRADES.M5, GRADES.M6] : [s.grade];
    const ladderPct = calcLadderCompletion(ladderProgress, s.id, s.grade);
    const echoTotal = calcTotalEchoPractice(ladderProgress, s.id, gradesUsed);
    const obTotal = calcObTotal(obCases, s.id, echoTotal);
    const gynTotal = calcGynTotal(gynCases, s.id);
    const times = laparoTimes[s.id] || [];
    const bestLaparo = times.length > 0 ? Math.min(...times.map(t => t.seconds)) : null;
    return { ladderPct, obTotal, gynTotal, bestLaparo };
  };

  // Student detail view
  const studentViewTabs = [
    { id: 'ladder', label: 'Ladder' },
    { id: 'combat', label: '戦闘力' },
    { id: 'laparo', label: 'ラパロ' },
  ];

  if (viewStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header tabs={studentViewTabs} activeTab={studentTab} onTabChange={setStudentTab} />
        <main className="max-w-6xl mx-auto p-4">
          <button onClick={() => setViewStudent(null)} className="text-xs text-pink-500 hover:text-pink-700 mb-3">&larr; 学生一覧に戻る</button>
          <div className="bg-pink-50 rounded-lg p-2 mb-4 text-sm font-medium text-pink-700">{viewStudent.name} ({GRADE_LABELS[viewStudent.grade]}) の詳細</div>
          {studentTab === 'ladder' && <LadderTab viewStudentId={viewStudent.id} viewGrade={viewStudent.grade} />}
          {studentTab === 'combat' && <CombatTab viewStudentId={viewStudent.id} />}
          {studentTab === 'laparo' && <LaparoTab viewStudentId={viewStudent.id} />}
        </main>
      </div>
    );
  }

  // Filter students
  const filteredStudents = students.filter(s => s.grade === gradeFilter);
  const currentStudents = filteredStudents.filter(s => s.isCurrentRotation);
  const pastStudents = filteredStudents.filter(s => !s.isCurrentRotation);
  const displayStudents = showMode === 'current' ? currentStudents : filteredStudents;

  // Get affiliated hospital display
  const getAffiliatedDisplay = (s) => {
    const affHosp = HOSPITALS.find(h => h.id === s.affiliatedHospitalId);
    if (s.grade === GRADES.M5) {
      // 5年生: A班 / 関連病院名
      return `${s.group} / ${affHosp?.shortName || '未定'}`;
    } else {
      // 6年生: X班 / 大学Nw + 関連病院名
      const rotations = s.affiliatedRotations || [];
      const parts = [`大学${s.universityWeeks || 0}w`];
      rotations.forEach(r => {
        const h = HOSPITALS.find(h2 => h2.id === r.hospitalId);
        parts.push(`${h?.shortName || ''}${r.weeks}w`);
      });
      return `${s.group} / ${parts.join('+')}`;
    }
  };

  const renderStudentCard = (s) => {
    const stats = getStudentStats(s);
    return (
      <div key={s.id} className="bg-white rounded-xl shadow-sm p-3 relative">
        {/* 歯車ボタン */}
        <button onClick={(e) => { e.stopPropagation(); setEditUser(s); }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm">⚙️</button>

        <button onClick={() => { setViewStudent(s); setStudentTab('ladder'); }}
          className="w-full text-left">
          <div className="mb-2">
            <span className="font-medium text-sm text-gray-800">{s.name}</span>
            {s.isCurrentRotation && <span className="ml-1 text-[9px] bg-green-100 text-green-700 px-1 rounded">ローテ中</span>}
            <div className="text-[10px] text-gray-400 mt-0.5">{getAffiliatedDisplay(s)}</div>
          </div>
          <div className="flex gap-3 text-[10px]">
            <div className="flex-1">
              <div className="text-gray-400 mb-0.5">Ladder</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${stats.ladderPct}%` }} />
              </div>
              <span className="text-gray-600">{stats.ladderPct}%</span>
            </div>
            <div className="text-center">
              <div className="text-gray-400">産科</div>
              <div className="font-bold text-pink-600">{stats.obTotal}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">婦人科</div>
              <div className="font-bold text-purple-600">{stats.gynTotal}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">ラパロ</div>
              <div className="font-bold text-gray-700">{stats.bestLaparo ? `${stats.bestLaparo}秒` : '-'}</div>
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header tabs={INSTRUCTOR_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto p-4">
        {/* 学生一覧 */}
        {activeTab === 'students' && (
          <div>
            {/* 学年タブ */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setGradeFilter('M5')}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium ${gradeFilter === 'M5' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>5年生</button>
              <button onClick={() => setGradeFilter('M6')}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium ${gradeFilter === 'M6' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>6年生</button>
            </div>
            {/* 現在ローテ / 全学生 切替 */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setShowMode('current')}
                className={`px-3 py-1 text-[10px] rounded ${showMode === 'current' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>現在ローテ中</button>
              <button onClick={() => setShowMode('all')}
                className={`px-3 py-1 text-[10px] rounded ${showMode === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>過去含む全学生</button>
            </div>

            <h3 className="font-bold text-sm text-gray-600 mb-2">
              {GRADE_LABELS[gradeFilter]}（{displayStudents.length}名{showMode === 'current' ? ' ローテ中' : ''}）
            </h3>
            {displayStudents.length === 0 ? (
              <p className="text-xs text-gray-400">該当なし</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayStudents.map(s => renderStudentCard(s))}
              </div>
            )}
          </div>
        )}

        {/* 全体比較 */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">全体比較</h2>
            {['Ladder完了率', '産科戦闘力', '婦人科戦闘力', 'ラパロベスト'].map((metric, mi) => (
              <div key={metric} className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-bold text-sm text-gray-700 mb-2">{metric}</h3>
                <div className="space-y-1">
                  {[...students].sort((a, b) => {
                    const sa = getStudentStats(a);
                    const sb = getStudentStats(b);
                    const vals = [
                      [sa.ladderPct, sb.ladderPct],
                      [sa.obTotal, sb.obTotal],
                      [sa.gynTotal, sb.gynTotal],
                      [sa.bestLaparo || 9999, sb.bestLaparo || 9999],
                    ];
                    return mi === 3 ? vals[mi][0] - vals[mi][1] : vals[mi][1] - vals[mi][0];
                  }).map((s, i) => {
                    const stats = getStudentStats(s);
                    const val = [stats.ladderPct + '%', stats.obTotal, stats.gynTotal, stats.bestLaparo ? stats.bestLaparo + '秒' : '-'][mi];
                    return (
                      <div key={s.id} className="flex items-center gap-2 text-xs py-1">
                        <span className="w-5 text-gray-400">{i + 1}.</span>
                        <span className="flex-1 text-gray-700">{s.name}</span>
                        <span className="text-[10px] text-gray-400">{GRADE_LABELS[s.grade]}</span>
                        <span className="font-bold text-pink-600 w-12 text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 関連病院比較 */}
        {activeTab === 'hospital' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">関連病院比較</h2>
            {HOSPITALS.filter(h => h.type === 'affiliated').map(hosp => {
              const evalAvgs = calcHospitalEvalAverages(evaluations, hosp.id);
              const hospSurveys = surveys.filter(sv => sv.hospitalId === hosp.id);
              // 過去にこの病院をローテした学生
              const rotatedStudents = students.filter(s => {
                const rotations = s.affiliatedRotations || [];
                return rotations.some(r => r.hospitalId === hosp.id) || s.affiliatedHospitalId === hosp.id;
              });

              return (
                <div key={hosp.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-700">{hosp.name}</h3>
                    <span className="text-[10px] text-gray-400">ローテ{rotatedStudents.length}名</span>
                  </div>
                  {evalAvgs && (
                    <div className="flex gap-2 mb-2">
                      {EVALUATION_CATEGORIES.map(cat => (
                        <div key={cat.id} className="text-center text-[10px]">
                          <div className="text-gray-400">{cat.label}</div>
                          <div className={`font-bold ${evalAvgs[cat.id] >= 4 ? 'text-green-600' : evalAvgs[cat.id] >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {evalAvgs[cat.id]}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {hospSurveys.length > 0 && (
                    <div className="text-[10px] text-gray-500 mb-2">
                      アンケート回答: {hospSurveys.length}件 |
                      満足度平均: {(hospSurveys.reduce((s, sv) => s + sv.satisfaction, 0) / hospSurveys.length).toFixed(1)}
                    </div>
                  )}
                  {/* 過去ローテ学生の経験症例 */}
                  {rotatedStudents.length > 0 && (
                    <div className="mt-2 border-t pt-2">
                      <div className="text-[10px] font-medium text-gray-600 mb-1">ローテ学生の経験症例</div>
                      {rotatedStudents.map(s => {
                        const stats = getStudentStats(s);
                        return (
                          <div key={s.id} className="flex items-center gap-2 text-[10px] py-0.5">
                            <span className="text-gray-600 w-20">{s.name}</span>
                            <span className="text-gray-400">{GRADE_LABELS[s.grade]}</span>
                            <span className="text-pink-600">産{stats.obTotal}</span>
                            <span className="text-purple-600">婦{stats.gynTotal}</span>
                            <span className="text-gray-500">ラパロ{stats.bestLaparo ? stats.bestLaparo + '秒' : '-'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!evalAvgs && hospSurveys.length === 0 && rotatedStudents.length === 0 && (
                    <p className="text-[10px] text-gray-400">データなし</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 指導タブ */}
        {activeTab === 'teaching' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">指導実績</h2>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 mb-2">「熱心な先生」選出回数</h3>
              {(() => {
                const teacherCounts = {};
                evaluations.forEach(ev => {
                  if (ev.enthusiasticTeacher) {
                    teacherCounts[ev.enthusiasticTeacher] = (teacherCounts[ev.enthusiasticTeacher] || 0) + 1;
                  }
                });
                const sorted = Object.entries(teacherCounts).sort((a, b) => b[1] - a[1]);
                if (sorted.length === 0) return <p className="text-xs text-gray-400">データなし</p>;
                return sorted.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-2 text-xs py-1 border-b border-gray-50">
                    <span className="w-5 text-gray-400">{i + 1}.</span>
                    <span className="flex-1 text-gray-700">{name}</span>
                    <span className="font-bold text-pink-600">{count}回</span>
                  </div>
                ));
              })()}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 mb-2">Ladder承認（ログ指導）回数</h3>
              <p className="text-xs text-gray-400">Ladder実技ログの指導医フィールドから自動集計されます</p>
            </div>
          </div>
        )}

        {/* 設定 */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">設定</h2>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 mb-3">生徒管理</h3>
              <div className="space-y-2">
                {students.map(s => {
                  return (
                    <div key={s.id} className="flex items-center gap-2 text-xs py-1.5 border-b border-gray-50">
                      <span className="flex-1 font-medium">{s.name}</span>
                      <span className="text-gray-400">{GRADE_LABELS[s.grade]}</span>
                      <span className="text-gray-400">{s.group}</span>
                      <span className="text-gray-400">{getAffiliatedDisplay(s)}</span>
                      <button onClick={() => setEditUser(s)}
                        className="text-pink-500 hover:text-pink-700 text-[10px]">編集</button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 mb-2">データ管理</h3>
              <button onClick={() => {
                if (confirm('全データをリセットしますか？')) {
                  Object.keys(localStorage).filter(k => k.startsWith('orbit_')).forEach(k => localStorage.removeItem(k));
                  window.location.reload();
                }
              }}
                className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded">
                全データリセット
              </button>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editUser && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 w-full max-w-sm space-y-3">
              <h3 className="font-bold text-sm">生徒情報編集</h3>
              <input value={editUser.name} onChange={e => setEditUser(p => ({ ...p, name: e.target.value }))}
                className="w-full text-xs border rounded px-2 py-1.5" placeholder="名前" />
              <select value={editUser.grade || ''} onChange={e => setEditUser(p => ({ ...p, grade: e.target.value }))}
                className="w-full text-xs border rounded px-2 py-1.5">
                <option value="M5">5年生(SGT)</option>
                <option value="M6">6年生(高次)</option>
              </select>
              <input value={editUser.group || ''} onChange={e => setEditUser(p => ({ ...p, group: e.target.value }))}
                className="w-full text-xs border rounded px-2 py-1.5" placeholder="班名" />
              <select value={editUser.affiliatedHospitalId || ''} onChange={e => setEditUser(p => ({ ...p, affiliatedHospitalId: e.target.value }))}
                className="w-full text-xs border rounded px-2 py-1.5">
                <option value="">関連病院未定</option>
                {HOSPITALS.filter(h => h.type === 'affiliated').map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <input value={editUser.email || ''} onChange={e => setEditUser(p => ({ ...p, email: e.target.value }))}
                className="w-full text-xs border rounded px-2 py-1.5" placeholder="メールアドレス" />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={editUser.isCurrentRotation || false}
                  onChange={e => setEditUser(p => ({ ...p, isCurrentRotation: e.target.checked }))} />
                現在ローテ中
              </label>
              <div className="flex gap-2">
                <button onClick={() => { updateUser(editUser.id, editUser); setEditUser(null); }}
                  className="flex-1 text-xs bg-pink-500 text-white py-2 rounded-lg">保存</button>
                <button onClick={() => setEditUser(null)}
                  className="flex-1 text-xs bg-gray-200 text-gray-600 py-2 rounded-lg">キャンセル</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
