import { useAuth } from '../contexts/AuthContext.jsx';
import { GRADE_LABELS, HOSPITALS, ROLES } from '../data/constants.js';

export default function Header({ tabs, activeTab, onTabChange }) {
  const { currentUser, logout } = useAuth();
  const hospital = HOSPITALS.find(h => h.id === currentUser.hospitalId);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-gray-800">ORBIT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-gray-500">
              <div className="font-medium text-gray-800">{currentUser.name}</div>
              <div>
                {currentUser.grade ? GRADE_LABELS[currentUser.grade] : currentUser.role === ROLES.INSTRUCTOR ? '指導医' : '管理者'}
                {currentUser.group ? ` / ${currentUser.group}` : ''}
                {hospital ? ` / ${hospital.shortName}` : ''}
              </div>
            </div>
            <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition px-2 py-1 rounded">
              ログアウト
            </button>
          </div>
        </div>
        {/* Tabs */}
        {tabs && (
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
