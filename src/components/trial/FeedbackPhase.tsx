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
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      {/* 提示文案 */}
      <div className="text-center">
        <p className="text-lg text-gray-700">
          この単語とその意味をしっかり覚えてください。終了後に語彙テストがあります。
        </p>
      </div>

      {/* 句子展示 */}
      <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
        {renderSentence()}
      </div>

      {/* 正确答案展示 */}
      <div className="w-full bg-green-50 rounded-lg p-6 border-2 border-green-300">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-2xl font-bold text-green-700">
              {trial.word.correctMeaning}；{trial.word.chineseMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* 倒计时 */}
      <CountdownTimer 
        duration={trial.durationSeconds} 
        onComplete={handleComplete} 
      />
    </div>
  );
}
