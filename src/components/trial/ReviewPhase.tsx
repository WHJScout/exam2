'use client';

import { useRef, useEffect, useCallback } from 'react';
import { CurrentTrial, Response } from '@/types';
import { CountdownTimer } from './CountdownTimer';
import { getConditionLabel } from '@/data/words';

interface ReviewPhaseProps {
  trial: CurrentTrial;
  participantId: string;
  onComplete: (response: Omit<Response, 'id'>) => void;
}

export function ReviewPhase({ trial, participantId, onComplete }: ReviewPhaseProps) {
  const shownAtRef = useRef<Date>(new Date());

  useEffect(() => {
    shownAtRef.current = new Date();
  }, [trial.trialIndex]);

  const handleComplete = useCallback(() => {
    const submittedAt = new Date();
    const responseTimeMs = submittedAt.getTime() - shownAtRef.current.getTime();

    // Review阶段汇总所有4个句子
    const allSentences = trial.sentences
      .map((s, idx) => `${idx + 1}. ${s.sentenceText}`)
      .join('\n');

    const response: Omit<Response, 'id'> = {
      participantId,
      trialId: trial.trialIndex + 1,
      trialIndex: trial.trialIndex,
      wordId: trial.word.id,
      wordText: trial.word.wordText,
      condition: trial.word.condition,
      conditionLabel: getConditionLabel(trial.word),
      exposureIndex: trial.exposureIndex,
      phase: 'review',
      sentenceText: allSentences,
      answerText: null, // review阶段无答案
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
  const renderSentence = (sentenceText: string) => {
    const wordPattern = `(${trial.word.wordText})`;
    const parts = sentenceText.split(wordPattern);
    
    return (
      <>
        {parts.map((part, index) => (
          part === trial.word.wordText ? (
            <span key={index} className="font-bold text-purple-600 bg-purple-100 px-1 rounded">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
          第 5 次学习 - 综合复习
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          复习阶段：<span className="text-purple-600">{trial.word.wordText}</span>
        </h2>
      </div>

      {/* 倒计时 */}
      <CountdownTimer 
        duration={trial.durationSeconds} 
        onComplete={handleComplete} 
      />

      {/* 4个句子汇总 */}
      <div className="w-full">
        <p className="text-lg font-medium text-gray-700 mb-4">
          请回顾 <span className="text-purple-600 font-bold">{trial.word.wordText}</span> 在以下4个句子中的用法：
        </p>
        
        <div className="space-y-3">
          {trial.sentences.map((sentence, index) => (
            <div 
              key={sentence.id} 
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <span className="inline-block w-6 h-6 bg-purple-200 text-purple-700 rounded-full text-center text-sm font-medium mr-2">
                {index + 1}
              </span>
              <span className="text-gray-800 leading-relaxed">
                {renderSentence(sentence.sentenceText)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 正确答案展示 */}
      <div className="w-full bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✓</span>
          <div>
            <p className="text-lg font-medium text-gray-700">意思：</p>
            <p className="text-2xl font-bold text-purple-700">
              {trial.word.correctMeaning}；{trial.word.chineseMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-sm text-gray-500">
        🎓 这是该词汇的最后一次复习，请好好记忆！{trial.durationSeconds}秒后自动进入下一词
      </p>
    </div>
  );
}
