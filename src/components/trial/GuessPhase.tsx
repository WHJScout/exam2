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
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      {/* 句子展示 */}
      <div className="w-full bg-gray-50 rounded-lg p-6 border border-gray-200">
        {renderSentence()}
      </div>

      {/* 指示文案 */}
      <div className="text-center space-y-2">
        <p className="text-lg text-gray-700">
          「（ ）」内の単語の意味を推測し、解答欄に入力してください。
        </p>
        <p className="text-sm text-gray-600">
          解答は日本語で記入しても、英語で記入しても、どちらでも構いません。
        </p>
      </div>

      {/* 输入区域 */}
      <div className="w-full max-w-md mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          解答欄
        </label>
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
        />
      </div>

      {/* 倒计时 */}
      <CountdownTimer 
        duration={trial.durationSeconds} 
        onComplete={() => handleSubmit(true)} 
      />
    </div>
  );
}
