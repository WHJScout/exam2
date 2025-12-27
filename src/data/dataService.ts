// 数据服务层 - 处理test分配和数据获取
import { TrialItem, TestType } from '@/types';
import { WARMUP_TRIALS } from './words_demo';

// 从 words_real.ts 导入原始数据
import REAL_DATA from './words_real';

// 转换原始数据为 TrialItem 格式
function convertToTrialItem(item: any, index: number): TrialItem {
  return {
    testType: item.testType?.replace(' ', '') || 'test1', // "test 1" -> "test1"
    order: parseInt(item.order) || index + 1,
    condition: item.condition || 'massed',
    word: item.word || '',
    meaning: item.meaning || '',
    sentence: item.sentence || '',
    theme: item.theme || '',
    subOrder: parseInt(item.subOrder) || 1,
    notes: item.notes || '',
    isWarmup: false,
  };
}

// 按 testType 分组并转换数据
const test1Data = REAL_DATA
  .filter((item: any) => item.testType === 'test 1')
  .map((item: any, index: number) => convertToTrialItem(item, index));

const test2Data = REAL_DATA
  .filter((item: any) => item.testType === 'test 2')
  .map((item: any, index: number) => convertToTrialItem(item, index));

const test3Data = REAL_DATA
  .filter((item: any) => item.testType === 'test 3')
  .map((item: any, index: number) => convertToTrialItem(item, index));

const test4Data = REAL_DATA
  .filter((item: any) => item.testType === 'test 4')
  .map((item: any, index: number) => convertToTrialItem(item, index));

/**
 * 根据学生编号分配测试类型
 * 001-005 → test1
 * 006-010 → test2
 * 011-015 → test3
 * 016-020 → test4
 * 021-025 → test1 (循环)
 * 026-030 → test2
 * 031-035 → test3
 * 036-040 → test4
 */
export function assignTestType(studentNo: string): TestType {
  const num = parseInt(studentNo);
  
  if (isNaN(num) || num < 1 || num > 40) {
    return 'test1'; // 默认（但不应该出现）
  }
  
  // 计算循环位置 (1-20)
  const position = ((num - 1) % 20) + 1;
  
  if (position >= 1 && position <= 5) {
    return 'test1';
  } else if (position >= 6 && position <= 10) {
    return 'test2';
  } else if (position >= 11 && position <= 15) {
    return 'test3';
  } else {
    return 'test4';
  }
}

/**
 * 验证学生编号是否有效（001-040）
 */
export function isValidStudentNo(studentNo: string): boolean {
  const num = parseInt(studentNo);
  return !isNaN(num) && num >= 1 && num <= 40;
}

/**
 * 获取热身题数据（5题）
 */
export function getWarmupTrials(): TrialItem[] {
  return WARMUP_TRIALS;
}

/**
 * 根据测试类型获取正式题数据
 */
export function getTestTrials(testType: TestType): TrialItem[] {
  switch (testType) {
    case 'test1':
      return test1Data;
    case 'test2':
      return test2Data;
    case 'test3':
      return test3Data;
    case 'test4':
      return test4Data;
    case 'warmup':
      return WARMUP_TRIALS;
    default:
      return test1Data;
  }
}

/**
 * 获取完整的试题序列（warmup + test）
 */
export function getFullTrialSequence(testType: TestType): TrialItem[] {
  const warmupTrials = getWarmupTrials();
  const testTrials = getTestTrials(testType);
  
  return [...warmupTrials, ...testTrials];
}

/**
 * 检查是否为热身阶段
 */
export function isWarmupPhase(trialIndex: number): boolean {
  return trialIndex < WARMUP_TRIALS.length;
}

/**
 * 获取当前进度信息
 */
export function getProgressInfo(trialIndex: number, testType: TestType) {
  const warmupCount = WARMUP_TRIALS.length;
  const testTrials = getTestTrials(testType);
  const totalCount = warmupCount + testTrials.length;
  
  return {
    isWarmup: isWarmupPhase(trialIndex),
    currentIndex: trialIndex,
    totalTrials: totalCount,
    warmupCount,
    testCount: testTrials.length,
    testProgress: isWarmupPhase(trialIndex) ? 0 : trialIndex - warmupCount + 1,
  };
}
