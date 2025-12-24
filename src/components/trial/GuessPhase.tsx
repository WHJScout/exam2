'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CurrentTrial, Response } from '@/types';
import { CountdownTimer } from './CountdownTimer';
import { getConditionLabel } from '@/data/words';

interface GuessPhaseProps {
  trial: CurrentTrial;
  participantId: string;
  onComplete: (response: Omit<Response, 'id'>) => void;
}

export function GuessPhase({ trial, participantId, onComplete }: GuessPhaseProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shownAtRef = useRef<Date>(new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    shownAtRef.current = new Date();
    setAnswer('');
    inputRef.current?.focus();
  }, [trial.trialIndex]);

  const handleSubmit = useCallback((isTimeout: boolean = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
      phase: 'guess',
      sentenceText: trial.sentence?.sentenceText || null,
      answerText: isTimeout && !answer.trim() ? '' : answer.trim(),
      correctAnswer: `${trial.word.correctMeaning}；${trial.word.chineseMeaning}`,
      isCorrect: null, // 后续人工判断
      isSubmittedByTimeout: isTimeout,
      shownAt: shownAtRef.current,
      submittedAt,
      responseTimeMs,
    };

    onComplete(response);
    setIsSubmitting(false);
  }, [answer, isSubmitting, participantId, trial, onComplete]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      handleSubmit(false);
    }
  };

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
            <span key={index} className="font-bold text-blue-600 bg-blue-100 px-1 rounded">
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
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
          第 {trial.exposureIndex} 次学习
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          猜测阶段：<span className="text-blue-600">{trial.word.wordText}</span>
        </h2>
      </div>

      {/* 倒计时 */}
      <CountdownTimer 
        duration={trial.durationSeconds} 
        onComplete={() => handleSubmit(true)} 
      />

      {/* 句子展示 */}
      <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
        {renderSentence()}
      </div>

      {/* 输入区域 */}
      <div className="w-full max-w-md">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          你认为 <span className="text-blue-600 font-bold">{trial.word.wordText}</span> 的意思是：
        </label>
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请输入你的答案..."
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
        />
      </div>

      {/* 提示 */}
      <p className="text-sm text-gray-500">
        💡 按 Enter 键快速提交，或等待倒计时结束自动进入下一题
      </p>
    </div>
  );
}
