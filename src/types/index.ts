// 词汇学习实验系统 - 类型定义

// 学习条件
export type Condition = 'massed' | 'spaced';

// 阶段类型
export type Phase = 'guess' | 'feedback' | 'review';

// 参与者状态
export type ParticipantStatus = 'in_progress' | 'completed' | 'abandoned';

// Test类型
export type TestType = 'warmup' | 'test1' | 'test2' | 'test3' | 'test4';

// Trial项
export interface TrialItem {
  testType: TestType;
  order: number;
  condition: Condition;
  word: string;
  meaning: string;
  sentence: string;
  theme: string;
  subOrder: number; // 1-5
  notes: string; // 备注
  isWarmup: boolean;
}

// 词汇
export interface Word {
  id: number;
  wordText: string;
  correctMeaning: string;
  chineseMeaning: string;
  condition: Condition;
  conditionIndex: number; // 1-10
}

// 句子
export interface Sentence {
  id: number;
  wordId: number;
  sentenceIndex: number; // 1-4
  sentenceText: string;
}

// 排程Trial
export interface ScheduleTrial {
  id: number;
  trialIndex: number; // 0-179
  wordId: number;
  exposureIndex: number; // 1-5
  phase: Phase;
  sentenceId: number | null;
  durationSeconds: number; // 20, 5, 或 15
  blockId: number; // 1-10
}

// 参与者
export interface Participant {
  id: string;
  participantCode: string;
  studentName: string; // 新增：学生姓名
  testType: TestType; // 新增：分配的测试类型
  sessionId: string;
  startedAt: Date;
  completedAt: Date | null;
  currentTrialIndex: number;
  status: ParticipantStatus;
  isWarmupCompleted: boolean; // 新增：是否完成热身
}

// 答题记录
export interface Response {
  id: string;
  participantId: string;
  trialId: number;
  trialIndex: number;
  wordId: number;
  wordText: string;
  order: number; // 新增：题目顺序
  condition: Condition;
  conditionLabel: string; // massed1, spaced3 等
  exposureIndex: number;
  phase: Phase;
  sentenceText: string | null;
  answerText: string | null;
  correctAnswer: string;
  isCorrect: boolean | null;
  isSubmittedByTimeout: boolean;
  theme: string; // 新增：主题
  subOrder: number; // 新增：子顺序
  notes: string; // 新增：备注
  isWarmup: boolean; // 新增：是否为热身题
  testType: TestType; // 新增：测试类型
  studentName: string; // 新增：学生姓名
  studentNo: string; // 新增：学生编号
  shownAt: Date;
  submittedAt: Date | null;
  responseTimeMs: number | null;
}

// 当前Trial的完整信息（用于UI展示）
export interface CurrentTrial {
  trialIndex: number;
  word: Word;
  exposureIndex: number;
  phase: Phase;
  sentence: Sentence | null;
  sentences: Sentence[]; // review阶段用
  durationSeconds: number;
  blockId: number;
}
