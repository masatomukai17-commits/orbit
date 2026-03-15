// ========================================
// ORBIT v2.0 — モックデータ
// ========================================
import { GRADES } from './constants.js';

// ---- ユーザー ----
// 5年生: 必ず大学2週+関連病院1週 → affiliatedHospitalId が関連病院
// 6年生: total4週間 → universityWeeks + affiliatedRotations[{hospitalId, weeks}]
// isCurrentRotation: true = 現在ローテ中
export const MOCK_USERS = [
  // 管理者
  { id: 'admin1', name: '向井先生', email: 'mukai@example.com', pin: '0000', role: 'admin', grade: null, hospitalId: 'h1', group: '', affiliatedHospitalId: null, universityWeeks: null, affiliatedRotations: null, isCurrentRotation: false },
  { id: 'admin2', name: '教授', email: 'prof@example.com', pin: '1111', role: 'admin', grade: null, hospitalId: 'h1', group: '', affiliatedHospitalId: null, universityWeeks: null, affiliatedRotations: null, isCurrentRotation: false },
  // 指導医
  { id: 'inst1', name: '佐藤医師', email: 'sato@example.com', pin: '2222', role: 'instructor', grade: null, hospitalId: 'h1', group: '', affiliatedHospitalId: null, universityWeeks: null, affiliatedRotations: null, isCurrentRotation: false },
  { id: 'inst2', name: '鈴木医師', email: 'suzuki@example.com', pin: '3333', role: 'instructor', grade: null, hospitalId: 'h2', group: '', affiliatedHospitalId: null, universityWeeks: null, affiliatedRotations: null, isCurrentRotation: false },
  { id: 'inst3', name: '高橋医師', email: 'takahashi@example.com', pin: '4444', role: 'instructor', grade: null, hospitalId: 'h6', group: '', affiliatedHospitalId: null, universityWeeks: null, affiliatedRotations: null, isCurrentRotation: false },
  // 5年生 (SGT): 大学2週+関連1週。hospitalIdは常にh1(大学)、affiliatedHospitalIdが関連病院
  { id: 's1', name: '田中太郎', email: 'tanaka@stu.example.com', pin: '5001', role: 'student', grade: GRADES.M5, hospitalId: 'h1', group: 'A班', affiliatedHospitalId: 'h2', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h2', weeks: 1 }], isCurrentRotation: true },
  { id: 's2', name: '山田花子', email: 'yamada@stu.example.com', pin: '5002', role: 'student', grade: GRADES.M5, hospitalId: 'h1', group: 'A班', affiliatedHospitalId: 'h4', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h4', weeks: 1 }], isCurrentRotation: true },
  { id: 's3', name: '佐々木一郎', email: 'sasaki@stu.example.com', pin: '5003', role: 'student', grade: GRADES.M5, hospitalId: 'h1', group: 'B班', affiliatedHospitalId: 'h6', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h6', weeks: 1 }], isCurrentRotation: false },
  { id: 's4', name: '伊藤美咲', email: 'ito@stu.example.com', pin: '5004', role: 'student', grade: GRADES.M5, hospitalId: 'h1', group: 'B班', affiliatedHospitalId: 'h9', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h9', weeks: 1 }], isCurrentRotation: false },
  { id: 's5', name: '渡辺健太', email: 'watanabe@stu.example.com', pin: '5005', role: 'student', grade: GRADES.M5, hospitalId: 'h1', group: 'C班', affiliatedHospitalId: 'h5', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h5', weeks: 1 }], isCurrentRotation: false },
  // 6年生 (高次): total 4週。大学2-4週 + 関連1週x1-2
  { id: 's6', name: '小林亮', email: 'kobayashi@stu.example.com', pin: '6001', role: 'student', grade: GRADES.M6, hospitalId: 'h1', group: 'X班', affiliatedHospitalId: 'h7', universityWeeks: 3, affiliatedRotations: [{ hospitalId: 'h7', weeks: 1 }], isCurrentRotation: true },
  { id: 's7', name: '加藤優子', email: 'kato@stu.example.com', pin: '6002', role: 'student', grade: GRADES.M6, hospitalId: 'h1', group: 'X班', affiliatedHospitalId: 'h10', universityWeeks: 2, affiliatedRotations: [{ hospitalId: 'h7', weeks: 1 }, { hospitalId: 'h10', weeks: 1 }], isCurrentRotation: true },
];

// ---- Echo Ladder進捗 ----
export const MOCK_LADDER_PROGRESS = {
  s1: {
    M5: {
      el1: { videoDone: true, quizDone: true, practiceCount: 7 },
      el2: { videoDone: true, quizDone: true, practiceCount: 5 },
      el3: { videoDone: true, quizDone: false, practiceCount: 0 },
      el4: { videoDone: false, quizDone: false, practiceCount: 0 },
      el5: { videoDone: false, quizDone: false, practiceCount: 0 },
    }
  },
  s2: {
    M5: {
      el1: { videoDone: true, quizDone: true, practiceCount: 5 },
      el2: { videoDone: true, quizDone: true, practiceCount: 5 },
      el3: { videoDone: true, quizDone: true, practiceCount: 5 },
      el4: { videoDone: true, quizDone: true, practiceCount: 5 },
      el5: { videoDone: true, quizDone: true, practiceCount: 6 },
    }
  },
  s3: {
    M5: {
      el1: { videoDone: true, quizDone: true, practiceCount: 3 },
      el2: { videoDone: true, quizDone: false, practiceCount: 0 },
    }
  },
  s6: {
    M5: {
      el1: { videoDone: true, quizDone: true, practiceCount: 5 },
      el2: { videoDone: true, quizDone: true, practiceCount: 5 },
      el3: { videoDone: true, quizDone: true, practiceCount: 5 },
      el4: { videoDone: true, quizDone: true, practiceCount: 5 },
      el5: { videoDone: true, quizDone: true, practiceCount: 5 },
    },
    M6: {
      el1: { videoDone: true, quizDone: true, practiceCount: 3 },
      el2: { videoDone: true, quizDone: true, practiceCount: 2 },
    }
  },
};

// ---- Echo Ladder実技ログ ----
export const MOCK_LADDER_LOGS = {
  s1: {
    M5: {
      el1: [
        { id: 'log1', date: '2026-01-10', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'BPD計測OK 38w2d', createdAt: '2026-01-10T09:00:00' },
        { id: 'log2', date: '2026-01-15', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'AC測定 36w5d', createdAt: '2026-01-15T10:00:00' },
        { id: 'log3', date: '2026-01-22', supervisor: '向井先生', hospitalId: 'h1', caseNote: 'FL計測スムーズ 39w0d', createdAt: '2026-01-22T14:00:00' },
        { id: 'log4', date: '2026-02-05', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '全計測自立可能 37w3d', createdAt: '2026-02-05T09:30:00' },
        { id: 'log5', date: '2026-02-12', supervisor: '向井先生', hospitalId: 'h1', caseNote: '双胎計測 34w1d', createdAt: '2026-02-12T11:00:00' },
        { id: 'log6', date: '2026-02-20', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '逆子疑い計測', createdAt: '2026-02-20T09:00:00' },
        { id: 'log7', date: '2026-03-01', supervisor: '向井先生', hospitalId: 'h1', caseNote: 'FGR症例計測', createdAt: '2026-03-01T10:00:00' },
      ],
      el2: [
        { id: 'log10', date: '2026-01-18', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'MCA計測', createdAt: '2026-01-18T09:00:00' },
        { id: 'log11', date: '2026-01-25', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'UA計測', createdAt: '2026-01-25T10:00:00' },
        { id: 'log12', date: '2026-02-01', supervisor: '向井先生', hospitalId: 'h1', caseNote: 'FGR症例のDoppler', createdAt: '2026-02-01T11:00:00' },
        { id: 'log13', date: '2026-02-10', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'PI/RI計測', createdAt: '2026-02-10T14:00:00' },
        { id: 'log14', date: '2026-02-18', supervisor: '向井先生', hospitalId: 'h1', caseNote: '正常と異常の比較', createdAt: '2026-02-18T10:00:00' },
      ],
    }
  },
};

// ---- 産科症例（レーダー用）大学/関連別 ----
export const MOCK_OB_CASES = {
  s1: {
    university: { ob_vd: 2, ob_inst: 0, ob_cs: 2, ob_exam: 4 },
    affiliated: { ob_vd: 1, ob_inst: 0, ob_cs: 0, ob_exam: 1 },
  },
  s2: {
    university: { ob_vd: 3, ob_inst: 1, ob_cs: 2, ob_exam: 5 },
    affiliated: { ob_vd: 2, ob_inst: 0, ob_cs: 1, ob_exam: 3 },
  },
  s6: {
    university: { ob_vd: 5, ob_inst: 2, ob_cs: 3, ob_exam: 8 },
    affiliated: { ob_vd: 3, ob_inst: 0, ob_cs: 2, ob_exam: 4 },
  },
};

// ---- 婦人科症例（レーダー用）大学/関連別 ----
export const MOCK_GYN_CASES = {
  s1: {
    university: {
      gyn_open: { go1: 1, go3: 1 },
      gyn_laparo: { gl3: 1 },
      gyn_skill: { gs1: 2, gs3: 2, gs4: 1 },
    },
    affiliated: {
      gyn_skill: { gs3: 1 },
    },
  },
  s2: {
    university: {
      gyn_open: { go1: 1, go2: 1, go3: 1 },
      gyn_laparo: { gl1: 1, gl3: 1 },
      gyn_skill: { gs1: 2, gs2: 1, gs3: 3, gs4: 2 },
    },
    affiliated: {
      gyn_open: { go1: 1 },
      gyn_laparo: { gl3: 1 },
      gyn_vaginal: { gv1: 1, gv4: 1 },
      gyn_skill: { gs1: 1, gs3: 2, gs5: 1 },
    },
  },
  s6: {
    university: {
      gyn_open: { go1: 2, go2: 1, go3: 1, go4: 1 },
      gyn_laparo: { gl1: 1, gl2: 1, gl3: 2, gl5: 1 },
      gyn_robot: { gr1: 1 },
      gyn_skill: { gs1: 3, gs2: 2, gs3: 5, gs4: 3, gs5: 1 },
    },
    affiliated: {
      gyn_open: { go1: 1, go2: 1, go3: 1 },
      gyn_laparo: { gl1: 1, gl3: 1 },
      gyn_vaginal: { gv1: 2, gv4: 2 },
      gyn_hysteroscopy: { gh2: 1 },
      gyn_skill: { gs1: 2, gs2: 1, gs3: 3, gs4: 1, gs5: 1 },
    },
  },
};

// ---- 産科マトリクス（疾患×手技, 大学/関連分け） ----
export const MOCK_OB_MATRIX = {
  s1: {
    dis_hdp: { mx_vd: { university: 1, affiliated: 0 }, mx_cs: { university: 1, affiliated: 0 } },
    dis_prom: { mx_vd: { university: 1, affiliated: 0 } },
    dis_primipara: { mx_vd: { university: 1, affiliated: 0 }, mx_echo: { university: 2, affiliated: 0 } },
  },
  s6: {
    dis_hdp: { mx_vd: { university: 2, affiliated: 1 }, mx_cs: { university: 1, affiliated: 1 } },
    dis_twin: { mx_cs: { university: 1, affiliated: 0 } },
    dis_prom: { mx_vd: { university: 1, affiliated: 1 } },
    dis_preterm: { mx_vd: { university: 0, affiliated: 1 }, mx_cs: { university: 1, affiliated: 0 } },
    dis_fgr: { mx_echo: { university: 2, affiliated: 1 } },
    dis_primipara: { mx_vd: { university: 2, affiliated: 1 }, mx_echo: { university: 3, affiliated: 1 } },
    dis_multipara: { mx_vd: { university: 1, affiliated: 2 } },
  },
};

// ---- ラパロタイム（純粋な結紮タイム、症例とは紐付けない） ----
// 二重結紮→単結紮→単結紮→締結→cutまでの時間(秒)
export const MOCK_LAPARO_TIMES = {
  s1: [
    { id: 'lt1', date: '2026-01-20', seconds: 180, memo: '初回、手が震えた' },
    { id: 'lt2', date: '2026-01-25', seconds: 155, memo: '少しスムーズに' },
    { id: 'lt3', date: '2026-02-05', seconds: 130, memo: '二重結紮がまだ遅い' },
    { id: 'lt4', date: '2026-02-15', seconds: 118, memo: '締結のコツ掴んだ' },
    { id: 'lt5', date: '2026-03-01', seconds: 105, memo: 'cutまでスムーズ' },
  ],
  s2: [
    { id: 'lt10', date: '2026-01-22', seconds: 200, memo: '初回' },
    { id: 'lt11', date: '2026-02-01', seconds: 165, memo: '二重結紮の改善' },
    { id: 'lt12', date: '2026-02-20', seconds: 140, memo: 'だいぶ安定した' },
  ],
  s6: [
    { id: 'lt20', date: '2025-06-10', seconds: 190, memo: '5年時 初回' },
    { id: 'lt21', date: '2025-07-15', seconds: 150, memo: '5年時 2回目' },
    { id: 'lt22', date: '2025-09-20', seconds: 125, memo: '5年時 3回目' },
    { id: 'lt23', date: '2026-01-15', seconds: 100, memo: '6年 復帰、感覚戻った' },
    { id: 'lt24', date: '2026-02-20', seconds: 88, memo: '6年 ベストタイム更新' },
  ],
};

// ---- 逆評定 ----
export const MOCK_EVALUATIONS = [
  {
    id: 'ev1', studentId: 's1', grade: 'M5', hospitalId: 'h1',
    rotationPeriod: '2026年1月',
    scores: { teaching: 5, feedback: 4, environment: 5, accessibility: 5, overall: 5 },
    enthusiasticTeacher: '向井先生',
    comment: '非常に丁寧に教えていただきました。',
    createdAt: '2026-02-15T12:00:00',
  },
  {
    id: 'ev2', studentId: 's2', grade: 'M5', hospitalId: 'h1',
    rotationPeriod: '2026年1月',
    scores: { teaching: 4, feedback: 4, environment: 5, accessibility: 4, overall: 4 },
    enthusiasticTeacher: '佐藤医師',
    comment: 'エコーの指導が丁寧でした。',
    createdAt: '2026-02-15T13:00:00',
  },
  {
    id: 'ev3', studentId: 's3', grade: 'M5', hospitalId: 'h2',
    rotationPeriod: '2026年1月',
    scores: { teaching: 3, feedback: 2, environment: 4, accessibility: 3, overall: 3 },
    enthusiasticTeacher: '鈴木医師',
    comment: '症例は多いが指導時間が限られている。',
    createdAt: '2026-02-16T10:00:00',
  },
  {
    id: 'ev4', studentId: 's5', grade: 'M5', hospitalId: 'h5',
    rotationPeriod: '2026年2月',
    scores: { teaching: 4, feedback: 5, environment: 3, accessibility: 5, overall: 4 },
    enthusiasticTeacher: '高橋医師',
    comment: '先生がフレンドリーで質問しやすい。',
    createdAt: '2026-03-02T11:00:00',
  },
  {
    id: 'ev5', studentId: 's6', grade: 'M6', hospitalId: 'h1',
    rotationPeriod: '2026年1月',
    scores: { teaching: 5, feedback: 5, environment: 5, accessibility: 5, overall: 5 },
    enthusiasticTeacher: '向井先生',
    comment: '6年生として戻り、さらに深い指導を受けられた。',
    createdAt: '2026-02-20T14:00:00',
  },
  {
    id: 'ev6', studentId: 's7', grade: 'M6', hospitalId: 'h7',
    rotationPeriod: '2026年2月',
    scores: { teaching: 3, feedback: 3, environment: 3, accessibility: 4, overall: 3 },
    enthusiasticTeacher: '',
    comment: 'アットホームだがもう少し構造化された指導があると良い。',
    createdAt: '2026-03-05T10:00:00',
  },
];

// ---- アンケート ----
export const MOCK_SURVEYS = [
  {
    id: 'sv1', studentId: 's2', grade: 'M5', hospitalId: 'h1',
    satisfaction: 5,
    goodPoints: ['gp1', 'gp2', 'gp3'],
    badPoints: ['bp6'],
    badPointsOther: '',
    careerChoice: '100%',
    recommendToJunior: null,
    comment: '充実した実習でした。',
    createdAt: '2026-03-01T15:00:00',
  },
  {
    id: 'sv2', studentId: 's6', grade: 'M6', hospitalId: 'h1',
    satisfaction: 5,
    goodPoints: ['gp1', 'gp2', 'gp4', 'gp5'],
    badPoints: ['bp5'],
    badPointsOther: '',
    careerChoice: '100%',
    recommendToJunior: 5,
    comment: '産婦人科を選んで良かった。',
    createdAt: '2026-02-25T15:00:00',
  },
  {
    id: 'sv3', studentId: 's7', grade: 'M6', hospitalId: 'h7',
    satisfaction: 3,
    goodPoints: ['gp3', 'gp6'],
    badPoints: ['bp1', 'bp3'],
    badPointsOther: '',
    careerChoice: '50%以下',
    recommendToJunior: 3,
    comment: '女性医療には興味があるがQOLが心配。',
    createdAt: '2026-03-05T11:00:00',
  },
];
