// ========================================
// ORBIT v2.0 — 定数定義
// ========================================

// ---- ロール ----
export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

// ---- 学年 ----
export const GRADES = {
  M5: 'M5',
  M6: 'M6',
  RESIDENT: 'resident',
};

export const GRADE_LABELS = {
  M5: '5年生(SGT)',
  M6: '6年生(高次)',
  resident: '研修医',
};

// ---- Echo Ladder コンテンツ ----
export const ECHO_LADDER = [
  { id: 'el1', title: '推定体重計測', practiceRequired: 5 },
  { id: 'el2', title: 'Doppler計測(MCA・UA)', practiceRequired: 5 },
  { id: 'el3', title: 'Screening', practiceRequired: 5 },
  { id: 'el4', title: '心エコー', practiceRequired: 5 },
  { id: 'el5', title: 'CNS', practiceRequired: 5 },
];

// ---- 病院一覧 ----
export const HOSPITALS = [
  { id: 'h1', name: '東北大学病院', shortName: '大学', type: 'university' },
  { id: 'h2', name: '仙台市立病院', shortName: '市立', type: 'affiliated' },
  { id: 'h4', name: '大崎市民病院', shortName: '大崎', type: 'affiliated' },
  { id: 'h5', name: '仙台赤十字病院', shortName: '赤十字', type: 'affiliated' },
  { id: 'h6', name: '仙台医療センター', shortName: '医療C', type: 'affiliated' },
  { id: 'h7', name: '石巻赤十字病院', shortName: '石巻', type: 'affiliated' },
  { id: 'h8', name: 'スズキ記念病院', shortName: 'スズキ', type: 'affiliated' },
  { id: 'h9', name: '坂総合病院', shortName: '坂総合', type: 'affiliated' },
  { id: 'h10', name: '県南中核病院', shortName: '県南', type: 'affiliated' },
];

// ---- 産科カテゴリ（戦闘力レーダー） ----
export const OB_CATEGORIES = [
  { id: 'ob_vd', label: '経腟分娩' },
  { id: 'ob_inst', label: '器械分娩' },
  { id: 'ob_cs', label: '帝王切開' },
  { id: 'ob_echo', label: '経腹エコー' }, // echo ladderのpractice合計を反映
  { id: 'ob_exam', label: '内診' },
];

// ---- 産科疾患群（マトリクス表示用） ----
export const OB_DISEASES = [
  { id: 'dis_hdp', label: 'HDP' },
  { id: 'dis_twin', label: 'Twin' },
  { id: 'dis_prom', label: 'PROM' },
  { id: 'dis_preterm', label: 'Preterm' },
  { id: 'dis_fgr', label: 'FGR' },  // 胎児発育不全 ※IUGR表記禁止
  { id: 'dis_precs', label: 'pre C/S' },
  { id: 'dis_previa', label: 'Previa' },
  { id: 'dis_bel', label: 'BEL' },
  { id: 'dis_multipara', label: '経産婦' },
  { id: 'dis_primipara', label: '初産婦' },
];

// 産科マトリクスの縦軸
export const OB_MATRIX_ROWS = [
  { id: 'mx_vd', label: '経腟分娩' },
  { id: 'mx_inst', label: '器械分娩' },
  { id: 'mx_cs', label: '帝王切開' },
  { id: 'mx_echo', label: '経腹エコー' },
];

// ---- 婦人科カテゴリ（戦闘力レーダー） ----
export const GYN_CATEGORIES = [
  { id: 'gyn_open', label: '開腹' },
  { id: 'gyn_laparo', label: 'ラパロ' },
  { id: 'gyn_robot', label: 'ロボット' },
  { id: 'gyn_vaginal', label: '腟式' },
  { id: 'gyn_hysteroscopy', label: '子宮鏡' },
  { id: 'gyn_skill', label: '手技' },
];

// 婦人科サブ項目
export const GYN_SUB_ITEMS = {
  gyn_open: [
    { id: 'go1', label: '単純子宮全摘術' },
    { id: 'go2', label: '筋腫核出術' },
    { id: 'go3', label: '付属器切除術' },
    { id: 'go4', label: '子宮全摘術(リンパ節郭清含む)' },
  ],
  gyn_laparo: [
    { id: 'gl1', label: '子宮全摘術' },
    { id: 'gl2', label: '筋腫核出術' },
    { id: 'gl3', label: '付属器切除術' },
    { id: 'gl4', label: '異所性妊娠手術' },
    { id: 'gl5', label: '仙骨腟固定術' },
  ],
  gyn_robot: [
    { id: 'gr1', label: '子宮全摘術' },
    { id: 'gr2', label: '筋腫核出術' },
    { id: 'gr3', label: '仙骨腟固定術' },
  ],
  gyn_vaginal: [
    { id: 'gv1', label: '円錐切除術' },
    { id: 'gv2', label: '骨盤臓器脱手術' },
    { id: 'gv3', label: '単純子宮全摘術' },
    { id: 'gv4', label: '子宮内容除去術' },
  ],
  gyn_hysteroscopy: [
    { id: 'gh1', label: '粘膜下筋腫切除術' },
    { id: 'gh2', label: '内膜ポリープ切除術' },
    { id: 'gh3', label: '中隔切除術' },
  ],
  gyn_skill: [
    { id: 'gs1', label: '真皮縫合' },
    { id: 'gs2', label: '器械縫合' },
    { id: 'gs3', label: '糸結び' },
    { id: 'gs4', label: 'ラパロカメラ持ち' },
    { id: 'gs5', label: 'ラパロ操作' },
  ],
};

// ---- 逆評定カテゴリ ----
export const EVALUATION_CATEGORIES = [
  { id: 'teaching', label: '教え方' },
  { id: 'feedback', label: 'フィードバック' },
  { id: 'environment', label: '実習環境' },
  { id: 'accessibility', label: '質問のしやすさ' },
  { id: 'overall', label: '総合評価' },
];

// ---- アンケート：良かったこと ----
export const GOOD_POINTS = [
  { id: 'gp1', label: '分娩の経験' },
  { id: 'gp2', label: '手技の経験' },
  { id: 'gp3', label: '多様な症例' },
  { id: 'gp4', label: '手術' },
  { id: 'gp5', label: 'チーム医療' },
  { id: 'gp6', label: '患者対応' },
  { id: 'gp7', label: '当直実習' },
  { id: 'gp8', label: '講義や手技の実習' },
  { id: 'gp9', label: 'このアプリ' },
];

// ---- アンケート：不足に感じたこと ----
export const BAD_POINTS = [
  { id: 'bp1', label: '症例数' },
  { id: 'bp2', label: '手技の機会' },
  { id: 'bp3', label: '指導時間' },
  { id: 'bp4', label: 'フィードバック' },
  { id: 'bp5', label: '自己学習時間' },
  { id: 'bp6', label: '特に無し' },
  { id: 'bp7', label: 'その他' },
];

// ---- localStorage keys ----
export const STORAGE_KEYS = {
  USERS: 'orbit_users',
  LADDER_PROGRESS: 'orbit_ladder_progress',
  LADDER_LOGS: 'orbit_ladder_logs',
  OB_CASES: 'orbit_ob_cases',
  GYN_CASES: 'orbit_gyn_cases',
  OB_MATRIX: 'orbit_ob_matrix',
  LAPARO_TIMES: 'orbit_laparo_times',
  EVALUATIONS: 'orbit_evaluations',
  SURVEYS: 'orbit_surveys',
  AUTH: 'orbit_auth',
};

// ---- 学生タブ定義 ----
export const STUDENT_TABS = [
  { id: 'home', label: 'ホーム', icon: 'Home' },
  { id: 'ladder', label: 'Echo Ladder', icon: 'Layers' },
  { id: 'combat', label: '戦闘力', icon: 'Zap' },
  { id: 'laparo', label: 'ラパロタイム', icon: 'Timer' },
  { id: 'eval', label: '逆評定', icon: 'Star' },
  { id: 'survey', label: 'アンケート', icon: 'ClipboardList' },
];

// ---- 先生タブ定義 ----
export const INSTRUCTOR_TABS = [
  { id: 'students', label: '学生一覧', icon: 'Users' },
  { id: 'compare', label: '全体比較', icon: 'BarChart3' },
  { id: 'hospital', label: '関連病院比較', icon: 'Building2' },
  { id: 'teaching', label: '指導', icon: 'Award' },
  { id: 'settings', label: '設定', icon: 'Settings' },
];
