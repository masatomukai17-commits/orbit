import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { ECHO_CONTENTS, TECHNIQUE_CONTENTS, GRADE_LABELS } from '../data/constants.js';
import { getContentProgress, getLogs } from '../data/store.js';
import Header from '../components/Header.jsx';
import StepEditor from '../components/StepEditor.jsx';
import EvaluationForm from '../components/EvaluationForm.jsx';
import SurveyForm from '../components/SurveyForm.jsx';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { progress, practiceLogs } = useData();
  const [activeTab, setActiveTab] = useState('progress');
  const [selectedContent, setSelectedContent] = useState(null);

  const grade = currentUser.grade;
  const tabs = [
    { id: 'progress', label: 'マイ進捗', icon: '📊' },
    { id: 'logs', label: '実技ログ', icon: '📋' },
    { id: 'evaluation', label: '逆評定', icon: '⭐' },
    { id: 'survey', label: 'アンケート', icon: '📝' },
  ];

  const renderProgressCard = (content) => {
    const p = getContentProgress(progress, currentUser.id, grade, content.id);
    const logCount = getLogs(practiceLogs, currentUser.id, grade, content.id).length;
    const pCount = logCount || p.practiceCount;
    const steps = [p.videoDone, p.quizDone, pCount >= content.step3Required];
    const completedSteps = steps.filter(Boolean).length;
    const isComplete = completedSteps === 3;

    return (
      <button
        key={content.id}
        onClick={() => setSelectedContent(content)}
        className={`text-left p-4 rounded-xl border-2 transition hover:shadow-md ${
          isComplete ? 'border-green-300 bg-green-50' :
          completedSteps > 0 ? 'border-yellow-300 bg-yellow-50' :
          'border-gray-200 bg-white'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800">{content.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isComplete ? 'bg-green-200 text-green-800' :
            completedSteps > 0 ? 'bg-yellow-200 text-yellow-800' :
            'bg-gray-200 text-gray-600'
          }`}>
            {isComplete ? '完了' : `${completedSteps}/3`}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{content.description}</p>
        <div className="flex gap-2">
          <StepBadge label="V" done={p.videoDone} />
          <StepBadge label="Q" done={p.quizDone} />
          <StepBadge label={`P ${pCount}/${content.step3Required}`} done={pCount >= content.step3Required} partial={pCount > 0 && pCount < content.step3Required} />
        </div>
      </button>
    );
  };

  const allContents = [...ECHO_CONTENTS, ...TECHNIQUE_CONTENTS];
  const totalComplete = allContents.filter(c => {
    const p = getContentProgress(progress, currentUser.id, grade, c.id);
    const lc = getLogs(practiceLogs, currentUser.id, grade, c.id).length;
    return p.videoDone && p.quizDone && (lc || p.practiceCount) >= c.step3Required;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      <main className="max-w-4xl mx-auto p-4">
        {activeTab === 'progress' && (
          <>
            {/* Summary */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">全体進捗</p>
                  <p className="text-4xl font-bold mt-1">{totalComplete}/{allContents.length}</p>
                  <p className="text-pink-200 text-sm mt-1">コンテンツ完了</p>
                </div>
                <div className="w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${(totalComplete / allContents.length) * 100}, 100`} strokeLinecap="round" />
                    <text x="18" y="20.35" className="fill-white" fontSize="8" textAnchor="middle" fontWeight="bold">
                      {Math.round((totalComplete / allContents.length) * 100)}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Echo Ladder */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">エコーラダー</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {ECHO_CONTENTS.map(renderProgressCard)}
            </div>

            {/* Technique Ladder */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">テクニックラダー</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {TECHNIQUE_CONTENTS.map(renderProgressCard)}
            </div>
          </>
        )}

        {activeTab === 'logs' && (
          <LogsView studentId={currentUser.id} grade={grade} practiceLogs={practiceLogs} />
        )}

        {activeTab === 'evaluation' && <EvaluationForm />}
        {activeTab === 'survey' && <SurveyForm />}
      </main>

      {/* StepEditor Modal */}
      {selectedContent && (
        <StepEditor
          content={selectedContent}
          studentId={currentUser.id}
          grade={grade}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
}

function StepBadge({ label, done, partial }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
      done ? 'bg-green-100 text-green-700' :
      partial ? 'bg-yellow-100 text-yellow-700' :
      'bg-gray-100 text-gray-400'
    }`}>
      {label}{done ? ' ✓' : ''}
    </span>
  );
}

function LogsView({ studentId, grade, practiceLogs }) {
  const allLogs = [];
  const contents = [...ECHO_CONTENTS, ...TECHNIQUE_CONTENTS];
  contents.forEach(c => {
    const logs = getLogs(practiceLogs, studentId, grade, c.id);
    logs.forEach(log => allLogs.push({ ...log, contentTitle: c.title, contentId: c.id }));
  });
  allLogs.sort((a, b) => b.date.localeCompare(a.date));

  if (allLogs.length === 0) {
    return <div className="text-center text-gray-400 py-12">実技ログはまだありません</div>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-800">実技ログ一覧（{allLogs.length}件）</h2>
      {allLogs.map(log => (
        <div key={log.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">{log.contentTitle}</span>
              <p className="text-sm text-gray-800 mt-1.5">{log.caseNote}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>{log.date}</div>
              <div>{log.supervisor}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
