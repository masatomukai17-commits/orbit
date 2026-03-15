import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LaparoTab({ viewStudentId }) {
  const { currentUser } = useAuth();
  const { laparoTimes, addLaparoTime } = useData();
  const sid = viewStudentId || currentUser.id;
  const times = (laparoTimes[sid] || []).sort((a, b) => a.date.localeCompare(b.date));

  const [form, setForm] = useState({ date: '', seconds: '', memo: '' });

  const chartData = times.map((t, i) => ({
    name: `${i + 1}回目`,
    seconds: t.seconds,
    date: t.date,
  }));

  const handleAdd = () => {
    if (!form.date || !form.seconds) return;
    addLaparoTime(sid, { ...form, seconds: parseInt(form.seconds) });
    setForm({ date: '', seconds: '', memo: '' });
  };

  const best = times.length > 0 ? Math.min(...times.map(t => t.seconds)) : 0;
  const avg = times.length > 0 ? Math.round(times.reduce((s, t) => s + t.seconds, 0) / times.length) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">ラパロタイム（結紮）</h2>
      <p className="text-[10px] text-gray-400">二重結紮→単結紮→単結紮→締結→cutまでの時間</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-3 text-center">
          <div className="text-[10px] text-gray-500">回数</div>
          <div className="text-xl font-bold text-purple-600">{times.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 text-center">
          <div className="text-[10px] text-gray-500">ベスト</div>
          <div className="text-xl font-bold text-pink-600">{best || '-'}秒</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 text-center">
          <div className="text-[10px] text-gray-500">平均</div>
          <div className="text-xl font-bold text-gray-700">{avg || '-'}秒</div>
        </div>
      </div>

      {/* Chart — 折れ線グラフ */}
      {times.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-2">経時的推移</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} unit="秒" />
              <Tooltip
                formatter={(value) => [`${value}秒`, 'タイム']}
                labelFormatter={(label) => {
                  const d = chartData.find(c => c.name === label);
                  return d ? d.date : label;
                }}
              />
              <defs>
                <linearGradient id="laparoLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="seconds" stroke="url(#laparoLineGrad)" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log list */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-bold text-sm text-gray-700 mb-2">記録一覧</h3>
        {times.length === 0 ? (
          <p className="text-xs text-gray-400">記録なし</p>
        ) : (
          <div className="space-y-1">
            {times.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-6">{i + 1}.</span>
                  <span className="text-gray-600">{t.date}</span>
                  <span className="text-gray-800 font-medium">{t.seconds}秒</span>
                </div>
                <span className="text-gray-500 text-[10px]">{t.memo}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add form */}
      {!viewStudentId && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-3">記録追加</h3>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="text-xs border rounded px-2 py-1.5" />
            <input type="number" placeholder="タイム(秒)" value={form.seconds} onChange={e => setForm(p => ({ ...p, seconds: e.target.value }))}
              className="text-xs border rounded px-2 py-1.5" />
            <input placeholder="メモ" value={form.memo} onChange={e => setForm(p => ({ ...p, memo: e.target.value }))}
              className="text-xs border rounded px-2 py-1.5 col-span-2" />
          </div>
          <button onClick={handleAdd}
            className="w-full mt-3 text-xs bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
            追加
          </button>
        </div>
      )}
    </div>
  );
}
