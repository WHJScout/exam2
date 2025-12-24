'use client';

import { useRef, useEffect, useCallback } from 'react';
import { CurrentTrial, Response } from '@/types';
import { CountdownTimer } from './CountdownTimer';
import { getConditionLabel } from '@/data/words';

interface FeedbackPhaseProps {
  trial: CurrentTrial;
  participantId: string;
  onComplete: (response: Omit<Response, 'id'>) => void;
}

export function FeedbackPhase({ trial, participantId, onComplete }: FeedbackPhaseProps) {
  const shownAtRef = useRef<Date>(new Date());

  useEffect(() => {
    shownAtRef.current = new Date();
  }, [trial.trialIndex]);

  const handleComplete = useCallback(() => {
    const submittedAt = new Date();
    const responseTimeMs = submittedAt.getTime() - shownAtRef.current.getTime();

    const response: Omit<Response, 'id'> = {
      participantId,
      trialId: trial.trialIndex + 1,
      trialIndex: trial.trialIndex,
      wordId: trial.word.id,
      wordText: trial.word.wordText,
      condition: trial.word.condition,
      conditionLabel: getConditionLabel(trial.word),
      exposureIndex: trial.exposureIndex,
      phase: 'feedback',
      sentenceText: trial.sentence?.sentenceText || null,
      answerText: null, // feedback阶段无答案
      correctAnswer: `${trial.word.correctMeaning}；${trial.word.chineseMeaning}`,
      isCorrect: null,
      isSubmittedByTimeout: false,
      shownAt: shownAtRef.current,
      submittedAt,
      responseTimeMs,
    };

    onComplete(response);
  }, [participantId, trial, onComplete]);

  // 高亮句子中的目标词
  const renderSentence = () => {
    if (!trial.sentence) return null;
    const text = trial.sentence.sentenceText;
    const wordPattern = `(${trial.word.wordText})`;
    const parts = text.split(wordPattern);
    
    return (
      <p className="text-xl leading-relaxed text-gray-800">
        {parts.map((part, index) => (
          part === trial.word.wordText ? (
            <span key={index} className="font-bold text-green-600 bg-green-100 px-1 rounded">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        ))}
      </p>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-3xl mx-auto">
      {/* 标题 */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
          第 {trial.exposureIndex} 次学习 - 正确答案
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          反馈阶段：<span className="text-green-600">{trial.word.wordText}</span>
        </h2>
      </div>

      {/* 倒计时 */}
      <CountdownTimer 
        duration={trial.durationSeconds} 
        onComplete={handleComplete} 
      />

      {/* 句子展示 */}
      <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
        {renderSentence()}
      </div>

      {/* 正确答案展示 */}
      <div className="w-full bg-green-50 rounded-lg p-6 border-2 border-green-300">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-lg font-medium text-gray-700">意思：</p>
            <p className="text-2xl font-bold text-green-700">
              {trial.word.correctMeaning}；{trial.word.chineseMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-sm text-gray-500">
        📖 请认真记忆这个词汇，{trial.durationSeconds}秒后自动进入下一题
      </p>
    </div>
  );
}
