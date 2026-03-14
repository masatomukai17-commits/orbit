import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLES, GRADE_LABELS, HOSPITALS } from '../data/constants.js';

const ROLE_LABELS = { admin: '管理者', instructor: '指導医', student: '学生' };

export default function Header({ activeTab, setActiveTab, tabs }) {
  const { currentUser, logout } = useAuth();
  const hospital = HOSPITALS.find(h => h.id === currentUser?.hospitalId);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-gray-800">ORBIT</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="font-medium text-gray-800">{currentUser?.name}</div>
              <div className="text-xs text-gray-400">
                {ROLE_LABELS[currentUser?.role]}
                {currentUser?.grade ? ` / ${GRADE_LABELS[currentUser.grade]}` : ''}
                {hospital ? ` / ${hospital.shortName}` : ''}
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 rounded-lg transition"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        {tabs && tabs.length > 0 && (
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
