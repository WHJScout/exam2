// 排程数据 - 180个Trial的完整顺序
import { ScheduleTrial, Phase, CurrentTrial } from '@/types';
import { WORDS, SENTENCES, getSentencesByWordId, getWordById } from './words';

// =====================================================
// 生成180个Trial的排程
// =====================================================

function generateSchedule(): ScheduleTrial[] {
  const schedule: ScheduleTrial[] = [];
  let trialIndex = 0;

  // Massed词汇ID: 1-10
  // Spaced词汇ID: 11-20

  // 轮次1-10
  for (let round = 1; round <= 10; round++) {
    const massedWordId = round; // M1-M10 对应 wordId 1-10

    // === Massed词汇的9个连续trial ===
    for (let exposure = 1; exposure <= 5; exposure++) {
      if (exposure < 5) {
        // 前4次: guess + feedback
        const sentenceId = (massedWordId - 1) * 4 + exposure; // 对应句子ID
        
        // Guess阶段
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: massedWordId,
          exposureIndex: exposure,
          phase: 'guess',
          sentenceId,
          durationSeconds: 20,
          blockId: round,
        });
        trialIndex++;

        // Feedback阶段
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: massedWordId,
          exposureIndex: exposure,
          phase: 'feedback',
          sentenceId,
          durationSeconds: 5,
          blockId: round,
        });
        trialIndex++;
      } else {
        // 第5次: review
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: massedWordId,
          exposureIndex: 5,
          phase: 'review',
          sentenceId: null,
          durationSeconds: 15,
          blockId: round,
        });
        trialIndex++;
      }
    }

    // === Spaced词汇 ===
    // 根据轮次决定哪组Spaced词汇出现
    // 奇数轮(1,3,5,7,9): S1-S5 (wordId 11-15)
    // 偶数轮(2,4,6,8,10): S6-S10 (wordId 16-20)
    const spacedGroup = round % 2 === 1 ? [11, 12, 13, 14, 15] : [16, 17, 18, 19, 20];
    
    // 计算这是该组的第几次出现
    // S1-5: 轮1=第1次, 轮3=第2次, 轮5=第3次, 轮7=第4次, 轮9=第5次
    // S6-10: 轮2=第1次, 轮4=第2次, 轮6=第3次, 轮8=第4次, 轮10=第5次
    const spacedExposure = Math.ceil(round / 2);

    for (const spacedWordId of spacedGroup) {
      if (spacedExposure < 5) {
        // 前4次: guess + feedback
        const sentenceId = (spacedWordId - 1) * 4 + spacedExposure;
        
        // Guess阶段
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: spacedWordId,
          exposureIndex: spacedExposure,
          phase: 'guess',
          sentenceId,
          durationSeconds: 20,
          blockId: round,
        });
        trialIndex++;

        // Feedback阶段
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: spacedWordId,
          exposureIndex: spacedExposure,
          phase: 'feedback',
          sentenceId,
          durationSeconds: 5,
          blockId: round,
        });
        trialIndex++;
      } else {
        // 第5次: review (只在轮9和轮10)
        schedule.push({
          id: trialIndex + 1,
          trialIndex,
          wordId: spacedWordId,
          exposureIndex: 5,
          phase: 'review',
          sentenceId: null,
          durationSeconds: 15,
          blockId: round,
        });
        trialIndex++;
      }
    }
  }

  return schedule;
}

// 生成并导出排程
export const SCHEDULE: ScheduleTrial[] = generateSchedule();

// 总Trial数量
export const TOTAL_TRIALS = SCHEDULE.length;

// =====================================================
// 帮助函数
// =====================================================

// 根据trial索引获取完整的trial信息
export function getCurrentTrial(trialIndex: number): CurrentTrial | null {
  const scheduleTrial = SCHEDULE[trialIndex];
  if (!scheduleTrial) return null;

  const word = getWordById(scheduleTrial.wordId);
  if (!word) return null;

  const sentences = getSentencesByWordId(scheduleTrial.wordId);
  const currentSentence = scheduleTrial.sentenceId 
    ? SENTENCES.find(s => s.id === scheduleTrial.sentenceId) || null
    : null;

  return {
    trialIndex: scheduleTrial.trialIndex,
    word,
    exposureIndex: scheduleTrial.exposureIndex,
    phase: scheduleTrial.phase,
    sentence: currentSentence,
    sentences, // review阶段需要所有4个句子
    durationSeconds: scheduleTrial.durationSeconds,
    blockId: scheduleTrial.blockId,
  };
}

// 获取排程trial
export function getScheduleTrial(trialIndex: number): ScheduleTrial | undefined {
  return SCHEDULE[trialIndex];
}
