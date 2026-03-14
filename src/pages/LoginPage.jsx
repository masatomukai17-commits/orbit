import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { loadUsers } from '../data/store.js';
import { ROLES, GRADE_LABELS } from '../data/constants.js';

export default function LoginPage() {
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(pin);
    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(''), 2000);
    }
  };

  const quickLogin = (userPin) => {
    login(userPin);
  };

  const users = loadUsers();
  const roleLabel = { admin: '管理者', instructor: '指導医', student: '学生/研修医' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl text-white font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ORBIT</h1>
          <p className="text-gray-500 mt-1">産婦人科臨床実習トラッカー</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PINコード</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4桁のPINを入力"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 rounded-lg p-2">{error}</div>
            )}
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 transition shadow-lg"
            >
              ログイン
            </button>
          </form>
        </div>

        {/* Demo Quick Login */}
        <div className="mt-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition"
          >
            {showGuide ? '▲ 閉じる' : '▼ デモ用クイックログイン'}
          </button>
          {showGuide && (
            <div className="mt-3 bg-white rounded-xl shadow-md p-4 space-y-3">
              {Object.entries(roleLabel).map(([role, label]) => (
                <div key={role}>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</div>
                  <div className="flex flex-wrap gap-2">
                    {users.filter(u => u.role === role).map(u => (
                      <button
                        key={u.id}
                        onClick={() => quickLogin(u.pin)}
                        className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-lg transition"
                      >
                        {u.name}
                        {u.grade ? ` (${GRADE_LABELS[u.grade]})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
