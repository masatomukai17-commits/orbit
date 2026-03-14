// ========================================
// ORBIT — 定数定義
// ========================================

export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

export const GRADES = {
  M5: 'M5',
  M6: 'M6',
  RESIDENT: 'resident',
};

export const GRADE_LABELS = {
  M5: '5年生',
  M6: '6年生',
  resident: '研修医',
};

// エコーラダー
export const ECHO_CONTENTS = [
  { id: 'e1', category: 'echo', title: '推定体重計測', description: 'BPD/AC/FLの計測', step3Required: 5, sortOrder: 1 },
  { id: 'e2', category: 'echo', title: '胎児心拍確認', description: 'FHR の確認と評価', step3Required: 3, sortOrder: 2 },
  { id: 'e3', category: 'echo', title: '羊水量評価', description: 'AFI/MVP の計測', step3Required: 3, sortOrder: 3 },
  { id: 'e4', category: 'echo', title: '胎盤位置評価', description: '胎盤付着部位の評価', step3Required: 3, sortOrder: 4 },
  { id: 'e5', category: 'echo', title: '経腟エコー', description: '子宮頸管長の計測', step3Required: 3, sortOrder: 5 },
];

// テクニックラダー
export const TECHNIQUE_CONTENTS = [
  { id: 't1', category: 'technique', title: '内診', description: '子宮口開大度・展退度', step3Required: 5, sortOrder: 1 },
  { id: 't2', category: 'technique', title: '分娩介助', description: '正常分娩の介助', step3Required: 3, sortOrder: 2 },
  { id: 't3', category: 'technique', title: '縫合', description: '会陰裂傷の縫合', step3Required: 3, sortOrder: 3 },
];

export const ALL_CONTENTS = [...ECHO_CONTENTS, ...TECHNIQUE_CONTENTS];

// 逆評定の質問項目
export const EVALUATION_CATEGORIES = [
  { id: 'teaching', label: '教え方', description: '説明のわかりやすさ、手技の指導' },
  { id: 'feedback', label: 'フィードバック', description: '建設的なフィードバックの質と頻度' },
  { id: 'environment', label: '実習環境', description: '症例数、経験の多様性' },
  { id: 'accessibility', label: '質問しやすさ', description: '指導医への質問のしやすさ' },
  { id: 'overall', label: '総合評価', description: '全体的な実習の満足度' },
];

// アンケート：産婦人科選択に影響する因子
export const INFLUENCE_FACTORS = [
  { id: 'f1', label: '手技の面白さ' },
  { id: 'f2', label: '指導医の人柄' },
  { id: 'f3', label: '分娩の感動' },
  { id: 'f4', label: '女性医療への関心' },
  { id: 'f5', label: 'QOL・働き方' },
  { id: 'f6', label: '給与・待遇' },
  { id: 'f7', label: '同期・先輩の影響' },
  { id: 'f8', label: 'エコーの楽しさ' },
  { id: 'f9', label: '学問的興味' },
  { id: 'f10', label: '実習内容の充実度' },
];

// 病院一覧
export const HOSPITALS = [
  { id: 'h1', name: '東北大学病院', shortName: '大学', type: 'university' },
  { id: 'h2', name: '仙台市立病院', shortName: '市立', type: 'affiliated' },
  { id: 'h3', name: '東北公済病院', shortName: '公済', type: 'affiliated' },
  { id: 'h4', name: '仙台赤十字病院', shortName: '赤十字', type: 'affiliated' },
  { id: 'h5', name: '大崎市民病院', shortName: '大崎', type: 'affiliated' },
];

// ストレージキー
export const STORAGE_KEYS = {
  USERS: 'orbit_users_v1',
  PROGRESS: 'orbit_progress_v1',
  PRACTICE_LOGS: 'orbit_practice_logs_v1',
  EVALUATIONS: 'orbit_evaluations_v1',
  SURVEYS: 'orbit_surveys_v1',
  AUTH: 'orbit_auth_v1',
};
