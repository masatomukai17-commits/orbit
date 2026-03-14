import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { ECHO_CONTENTS, TECHNIQUE_CONTENTS, GRADE_LABELS, HOSPITALS } from '../data/constants.js';
import { getContentProgress, getLogs } from '../data/store.js';
import Header from '../components/Header.jsx';
import StepEditor from '../components/StepEditor.jsx';

export default function InstructorDashboard() {
  const { currentUser } = useAuth();
  const { users, progress, practiceLogs, evaluations } = useData();
  const [activeTab, setActiveTab] = useState('heatmap');
  const [selectedCell, setSelectedCell] = useState(null);

  const tabs = [
    { id: 'heatmap', label: 'ヒートマップ', icon: '🗺️' },
    { id: 'myEvals', label: '逆評定結果', icon: '⭐' },
  ];

  // Students at this instructor's hospital
  const myStudents = users.filter(u => u.role === 'student' && u.hospitalId === currentUser.hospitalId);

  const renderHeatmapCell = (student, content) => {
    const p = getContentProgress(progress, student.id, student.grade, content.id);
    const logCount = getLogs(practiceLogs, student.id, student.grade, content.id).length;
    const pCount = logCount || p.practiceCount;
    const pDone = pCount >= content.step3Required;
    const allDone = p.videoDone && p.quizDone && pDone;

    return (
      <td
        key={content.id}
        onClick={() => setSelectedCell({ student, content })}
        className={`px-1 py-1.5 text-center cursor-pointer border border-gray-100 hover:ring-2 hover:ring-pink-300 transition text-xs ${
          allDone ? 'bg-green-100' : pCount > 0 || p.videoDone ? 'bg-yellow-50' : 'bg-white'
        }`}
      >
        <div className="leading-tight">
          <span className={p.videoDone ? 'text-green-600' : 'text-gray-300'}>V{p.videoDone ? '✓' : '·'}</span>
          {' '}
          <span className={p.quizDone ? 'text-green-600' : 'text-gray-300'}>Q{p.quizDone ? '✓' : '·'}</span>
          <br />
          <span className={pDone ? 'text-green-600 font-bold' : pCount > 0 ? 'text-yellow-600' : 'text-gray-300'}>
            P{pCount}/{content.step3Required}
          </span>
        </div>
      </td>
    );
  };

  const renderHeatmap = (title, contents) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-600 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left text-xs text-gray-500 font-medium sticky left-0 bg-gray-50 z-10">学生</th>
              {contents.map(c => (
                <th key={c.id} className="px-1 py-2 text-xs text-gray-500 font-medium whitespace-nowrap">{c.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myStudents.map(student => (
              <tr key={student.id} className="border-t border-gray-100">
                <td className="px-2 py-1.5 text-xs font-medium text-gray-700 sticky left-0 bg-white z-10 whitespace-nowrap">
                  {student.name}
                  <span className="text-gray-400 ml-1">({GRADE_LABELS[student.grade]})</span>
                </td>
                {contents.map(c => renderHeatmapCell(student, c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {myStudents.length === 0 && (
        <div className="text-center text-gray-400 py-8">この病院にローテ中の学生はいません</div>
      )}
    </div>
  );

  // My evaluations (reverse evaluations about this hospital)
  const myHospitalEvals = evaluations.filter(e => e.hospitalId === currentUser.hospitalId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'heatmap' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">ローテ学生進捗</h2>
                <span className="text-sm text-gray-400">{HOSPITALS.find(h => h.id === currentUser.hospitalId)?.name}</span>
              </div>
              {renderHeatmap('エコーラダー', ECHO_CONTENTS)}
              {renderHeatmap('テクニックラダー', TECHNIQUE_CONTENTS)}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 justify-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> 完了</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-300" /> 途中</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200" /> 未着手</span>
            </div>
          </>
        )}

        {activeTab === 'myEvals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">学生からの逆評定（匿名）</h2>
            {myHospitalEvals.length === 0 ? (
              <div className="text-center text-gray-400 py-12">まだ評価がありません</div>
            ) : (
              <>
                {/* Average scores */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-600 mb-3">平均スコア（{myHospitalEvals.length}件）</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {['teaching', 'feedback', 'environment', 'accessibility', 'overall'].map(cat => {
                      const avg = myHospitalEvals.reduce((s, e) => s + (e.scores[cat] || 0), 0) / myHospitalEvals.length;
                      const labels = { teaching: '教え方', feedback: 'FB', environment: '環境', accessibility: '質問', overall: '総合' };
                      return (
                        <div key={cat} className="text-center">
                          <div className="text-2xl font-bold text-pink-600">{avg.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">{labels[cat]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Comments */}
                <div className="space-y-2">
                  {myHospitalEvals.filter(e => e.comment).map(ev => (
                    <div key={ev.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-sm text-gray-600">
                      <p>"{ev.comment}"</p>
                      <div className="text-xs text-gray-400 mt-1">{ev.rotationPeriod} / {GRADE_LABELS[ev.grade]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* StepEditor Modal */}
      {selectedCell && (
        <StepEditor
          content={selectedCell.content}
          studentId={selectedCell.student.id}
          grade={selectedCell.student.grade}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}
