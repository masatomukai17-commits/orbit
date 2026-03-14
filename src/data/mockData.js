// ========================================
// ORBIT — モックデータ（デモ用）
// ========================================

import { GRADES } from './constants.js';

// ---- ユーザー ----
export const MOCK_USERS = [
  // 管理者
  { id: 'admin1', name: '向井先生', email: 'mukai@example.com', pin: '0000', role: 'admin', grade: null, hospitalId: 'h1' },
  { id: 'admin2', name: '教授', email: 'prof@example.com', pin: '1111', role: 'admin', grade: null, hospitalId: 'h1' },
  // 指導医
  { id: 'inst1', name: '佐藤医師', email: 'sato@example.com', pin: '2222', role: 'instructor', grade: null, hospitalId: 'h1' },
  { id: 'inst2', name: '鈴木医師', email: 'suzuki@example.com', pin: '3333', role: 'instructor', grade: null, hospitalId: 'h2' },
  { id: 'inst3', name: '高橋医師', email: 'takahashi@example.com', pin: '4444', role: 'instructor', grade: null, hospitalId: 'h3' },
  // 5年生
  { id: 's1', name: '田中太郎', email: 'tanaka@stu.example.com', pin: '5001', role: 'student', grade: GRADES.M5, hospitalId: 'h1' },
  { id: 's2', name: '山田花子', email: 'yamada@stu.example.com', pin: '5002', role: 'student', grade: GRADES.M5, hospitalId: 'h1' },
  { id: 's3', name: '佐々木一郎', email: 'sasaki@stu.example.com', pin: '5003', role: 'student', grade: GRADES.M5, hospitalId: 'h2' },
  { id: 's4', name: '伊藤美咲', email: 'ito@stu.example.com', pin: '5004', role: 'student', grade: GRADES.M5, hospitalId: 'h2' },
  { id: 's5', name: '渡辺健太', email: 'watanabe@stu.example.com', pin: '5005', role: 'student', grade: GRADES.M5, hospitalId: 'h3' },
  // 6年生
  { id: 's6', name: '小林亮', email: 'kobayashi@stu.example.com', pin: '6001', role: 'student', grade: GRADES.M6, hospitalId: 'h1' },
  { id: 's7', name: '加藤優子', email: 'kato@stu.example.com', pin: '6002', role: 'student', grade: GRADES.M6, hospitalId: 'h3' },
  // 研修医
  { id: 'r1', name: '松本翔太', email: 'matsumoto@stu.example.com', pin: '7001', role: 'student', grade: GRADES.RESIDENT, hospitalId: 'h1' },
];

// ---- 進捗データ ----
// progress[studentId][grade][contentId] = { videoDone, quizDone, practiceCount }
export const MOCK_PROGRESS = {
  s1: {
    M5: {
      e1: { videoDone: true, quizDone: true, practiceCount: 5 },
      e2: { videoDone: true, quizDone: true, practiceCount: 3 },
      e3: { videoDone: true, quizDone: false, practiceCount: 0 },
      e4: { videoDone: false, quizDone: false, practiceCount: 0 },
      t1: { videoDone: true, quizDone: true, practiceCount: 4 },
      t2: { videoDone: true, quizDone: false, practiceCount: 1 },
    }
  },
  s2: {
    M5: {
      e1: { videoDone: true, quizDone: true, practiceCount: 3 },
      e2: { videoDone: true, quizDone: true, practiceCount: 2 },
      e3: { videoDone: true, quizDone: true, practiceCount: 3 },
      e4: { videoDone: true, quizDone: true, practiceCount: 3 },
      e5: { videoDone: true, quizDone: false, practiceCount: 0 },
      t1: { videoDone: true, quizDone: true, practiceCount: 5 },
      t2: { videoDone: true, quizDone: true, practiceCount: 3 },
      t3: { videoDone: true, quizDone: false, practiceCount: 1 },
    }
  },
  s3: {
    M5: {
      e1: { videoDone: true, quizDone: true, practiceCount: 2 },
      e2: { videoDone: true, quizDone: false, practiceCount: 0 },
      t1: { videoDone: true, quizDone: true, practiceCount: 3 },
    }
  },
  s4: {
    M5: {
      e1: { videoDone: true, quizDone: true, practiceCount: 5 },
      e2: { videoDone: true, quizDone: true, practiceCount: 3 },
      e3: { videoDone: true, quizDone: true, practiceCount: 3 },
      e4: { videoDone: true, quizDone: true, practiceCount: 3 },
      e5: { videoDone: true, quizDone: true, practiceCount: 3 },
      t1: { videoDone: true, quizDone: true, practiceCount: 5 },
      t2: { videoDone: true, quizDone: true, practiceCount: 3 },
      t3: { videoDone: true, quizDone: true, practiceCount: 3 },
    }
  },
  s5: {
    M5: {
      e1: { videoDone: true, quizDone: false, practiceCount: 0 },
      t1: { videoDone: false, quizDone: false, practiceCount: 0 },
    }
  },
  s6: {
    M5: {
      e1: { videoDone: true, quizDone: true, practiceCount: 5 },
      e2: { videoDone: true, quizDone: true, practiceCount: 3 },
      e3: { videoDone: true, quizDone: true, practiceCount: 3 },
      t1: { videoDone: true, quizDone: true, practiceCount: 5 },
      t2: { videoDone: true, quizDone: true, practiceCount: 3 },
    },
    M6: {
      e1: { videoDone: true, quizDone: true, practiceCount: 3 },
      e4: { videoDone: true, quizDone: false, practiceCount: 1 },
      t3: { videoDone: true, quizDone: true, practiceCount: 2 },
    }
  },
  s7: {
    M6: {
      e1: { videoDone: true, quizDone: true, practiceCount: 4 },
      e2: { videoDone: true, quizDone: true, practiceCount: 3 },
      t1: { videoDone: true, quizDone: true, practiceCount: 3 },
      t2: { videoDone: true, quizDone: false, practiceCount: 1 },
    }
  },
  r1: {
    resident: {
      e1: { videoDone: true, quizDone: true, practiceCount: 5 },
      e2: { videoDone: true, quizDone: true, practiceCount: 3 },
      e3: { videoDone: true, quizDone: true, practiceCount: 3 },
      e4: { videoDone: true, quizDone: true, practiceCount: 3 },
      e5: { videoDone: true, quizDone: true, practiceCount: 3 },
      t1: { videoDone: true, quizDone: true, practiceCount: 5 },
      t2: { videoDone: true, quizDone: true, practiceCount: 3 },
      t3: { videoDone: true, quizDone: true, practiceCount: 3 },
    }
  },
};

// ---- 実技ログ ----
export const MOCK_PRACTICE_LOGS = {
  s1: {
    M5: {
      e1: [
        { id: 'log1', date: '2026-01-10', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'BPD計測OK 38w2d', createdAt: '2026-01-10T09:00:00' },
        { id: 'log2', date: '2026-01-15', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'AC測定に苦労 36w5d', createdAt: '2026-01-15T10:00:00' },
        { id: 'log3', date: '2026-01-22', supervisor: '向井先生', hospitalId: 'h1', caseNote: 'FL計測スムーズ 39w0d', createdAt: '2026-01-22T14:00:00' },
        { id: 'log4', date: '2026-02-05', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '全計測自立可能 37w3d', createdAt: '2026-02-05T09:30:00' },
        { id: 'log5', date: '2026-02-12', supervisor: '向井先生', hospitalId: 'h1', caseNote: '双胎の計測に挑戦 34w1d', createdAt: '2026-02-12T11:00:00' },
      ],
      e2: [
        { id: 'log6', date: '2026-01-12', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'FHR確認 正常パターン', createdAt: '2026-01-12T08:00:00' },
        { id: 'log7', date: '2026-01-20', supervisor: '向井先生', hospitalId: 'h1', caseNote: '一過性徐脈あり 経過観察', createdAt: '2026-01-20T15:00:00' },
        { id: 'log8', date: '2026-02-01', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'NST判読練習', createdAt: '2026-02-01T10:00:00' },
      ],
      t1: [
        { id: 'log9', date: '2026-01-14', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '初回内診 5cm/80%', createdAt: '2026-01-14T13:00:00' },
        { id: 'log10', date: '2026-01-25', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '全開大 先進部確認', createdAt: '2026-01-25T20:00:00' },
        { id: 'log11', date: '2026-02-03', supervisor: '向井先生', hospitalId: 'h1', caseNote: '3cm/50% 展退度判断改善', createdAt: '2026-02-03T16:00:00' },
        { id: 'log12', date: '2026-02-10', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '破水確認後の内診', createdAt: '2026-02-10T22:00:00' },
      ],
    }
  },
  s2: {
    M5: {
      e1: [
        { id: 'log20', date: '2026-01-08', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: '初回計測 指導あり', createdAt: '2026-01-08T09:00:00' },
        { id: 'log21', date: '2026-01-18', supervisor: '向井先生', hospitalId: 'h1', caseNote: '単独計測OK', createdAt: '2026-01-18T10:00:00' },
        { id: 'log22', date: '2026-02-08', supervisor: '佐藤医師', hospitalId: 'h1', caseNote: 'スムーズに計測', createdAt: '2026-02-08T11:00:00' },
      ],
    }
  },
};

// ---- 逆評定データ ----
export const MOCK_EVALUATIONS = [
  {
    id: 'ev1', studentId: 's1', grade: 'M5', hospitalId: 'h1',
    rotationPeriod: '2026年1月', instructorId: null,
    scores: { teaching: 5, feedback: 4, environment: 5, accessibility: 5, overall: 5 },
    comment: '非常に丁寧に教えていただきました。症例も豊富で充実した実習でした。',
    createdAt: '2026-02-15T12:00:00',
  },
  {
    id: 'ev2', studentId: 's2', grade: 'M5', hospitalId: 'h1',
    rotationPeriod: '2026年1月', instructorId: null,
    scores: { teaching: 4, feedback: 4, environment: 5, accessibility: 4, overall: 4 },
    comment: 'エコーの指導が丁寧でした。もう少しフィードバックの時間があると嬉しいです。',
    createdAt: '2026-02-15T13:00:00',
  },
  {
    id: 'ev3', studentId: 's3', grade: 'M5', hospitalId: 'h2',
    rotationPeriod: '2026年1月', instructorId: null,
    scores: { teaching: 3, feedback: 2, environment: 4, accessibility: 3, overall: 3 },
    comment: '症例は多いが、指導の時間が限られている印象。',
    createdAt: '2026-02-16T10:00:00',
  },
  {
    id: 'ev4', studentId: 's4', grade: 'M5', hospitalId: 'h2',
    rotationPeriod: '2026年2月', instructorId: null,
    scores: { teaching: 4, feedback: 3, environment: 4, accessibility: 4, overall: 4 },
    comment: '分娩が多く実践的な経験ができた。',
    createdAt: '2026-03-01T09:00:00',
  },
  {
    id: 'ev5', studentId: 's5', grade: 'M5', hospitalId: 'h3',
    rotationPeriod: '2026年2月', instructorId: null,
    scores: { teaching: 4, feedback: 5, environment: 3, accessibility: 5, overall: 4 },
    comment: '先生が非常にフレンドリーで質問しやすい環境。症例数はやや少なめ。',
    createdAt: '2026-03-02T11:00:00',
  },
  {
    id: 'ev6', studentId: 's6', grade: 'M6', hospitalId: 'h1',
    rotationPeriod: '2026年1月', instructorId: null,
    scores: { teaching: 5, feedback: 5, environment: 5, accessibility: 5, overall: 5 },
    comment: '6年生として戻ってきたが、さらに深い指導が受けられた。産婦人科を選んで良かった。',
    createdAt: '2026-02-20T14:00:00',
  },
  {
    id: 'ev7', studentId: 's7', grade: 'M6', hospitalId: 'h3',
    rotationPeriod: '2026年2月', instructorId: null,
    scores: { teaching: 3, feedback: 3, environment: 3, accessibility: 4, overall: 3 },
    comment: 'アットホームな雰囲気だが、もう少し構造化された指導があると良い。',
    createdAt: '2026-03-05T10:00:00',
  },
];

// ---- アンケートデータ ----
export const MOCK_SURVEYS = [
  {
    id: 'sv1', studentId: 's6', grade: 'M6', hospitalId: 'h1',
    chooseObgyn: 'yes',
    influenceFactors: ['f1', 'f3', 'f2', 'f8'],
    mostValuableContent: 'e1',
    npsScore: 9,
    comment: '5年生の実習で産婦人科の面白さに目覚め、6年生でも選択しました。',
    createdAt: '2026-02-25T15:00:00',
  },
  {
    id: 'sv2', studentId: 's7', grade: 'M6', hospitalId: 'h3',
    chooseObgyn: 'undecided',
    influenceFactors: ['f4', 'f5'],
    mostValuableContent: 't1',
    npsScore: 6,
    comment: '女性医療には興味があるが、QOLが心配。',
    createdAt: '2026-03-05T11:00:00',
  },
  {
    id: 'sv3', studentId: 'r1', grade: 'resident', hospitalId: 'h1',
    chooseObgyn: 'yes',
    influenceFactors: ['f1', 'f2', 'f3', 'f9'],
    mostValuableContent: 't2',
    npsScore: 10,
    comment: '分娩介助の経験が決め手でした。指導医の影響も大きい。',
    createdAt: '2026-01-20T16:00:00',
  },
];
