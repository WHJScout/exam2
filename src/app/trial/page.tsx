'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';
import { getCurrentTrial, TOTAL_TRIALS } from '@/data/schedule';
import { GuessPhase, FeedbackPhase, ReviewPhase } from '@/components/trial';
import { Response } from '@/types';

export default function TrialPage() {
  const router = useRouter();
  const { 
    participant, 
    addResponse, 
    nextTrial, 
    completeExperiment,
    getCurrentTrialIndex,
    isCompleted 
  } = useExperimentStore();

  const [currentTrialIndex, setCurrentTrialIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 客户端初始化
  useEffect(() => {
    // 检查登录状态
    if (!participant) {
      router.push('/');
      return;
    }

    // 检查是否已完成
    if (isCompleted()) {
      router.push('/complete');
      return;
    }

    setCurrentTrialIndex(getCurrentTrialIndex());
    setIsLoading(false);
  }, [participant, router, isCompleted, getCurrentTrialIndex]);

  // 处理试题完成
  const handleTrialComplete = useCallback((response: Omit<Response, 'id'>) => {
    // 保存答题记录
    addResponse(response);

    // 移动到下一题
    const nextIndex = (currentTrialIndex ?? 0) + 1;
    
    if (nextIndex >= TOTAL_TRIALS) {
      // 实验完成
      completeExperiment();
      router.push('/complete');
    } else {
      // 继续下一题
      nextTrial();
      setCurrentTrialIndex(nextIndex);
    }
  }, [currentTrialIndex, addResponse, nextTrial, completeExperiment, router]);

  // 加载中
  if (isLoading || currentTrialIndex === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 获取当前trial信息
  const trial = getCurrentTrial(currentTrialIndex);

  if (!trial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">无法加载试题，请刷新页面重试</p>
        </div>
      </div>
    );
  }

  // 计算进度
  const progress = ((currentTrialIndex + 1) / TOTAL_TRIALS) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部进度条 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              进度：{currentTrialIndex + 1} / {TOTAL_TRIALS}
            </span>
            <span className="text-sm text-gray-600">
              参与者：{participant?.participantCode}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 调试信息（开发用） */}
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="text-xs text-gray-400 bg-gray-200 rounded p-2">
          Trial #{currentTrialIndex} | 
          词汇: {trial.word.wordText} ({trial.word.condition}{trial.word.conditionIndex}) | 
          第{trial.exposureIndex}次 | 
          阶段: {trial.phase} | 
          时长: {trial.durationSeconds}s |
          轮次: {trial.blockId}
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto py-6 animate-fadeIn" key={currentTrialIndex}>
        <div className="bg-white rounded-xl shadow-lg">
          {trial.phase === 'guess' && (
            <GuessPhase 
              trial={trial} 
              participantId={participant!.id}
              onComplete={handleTrialComplete}
            />
          )}
          
          {trial.phase === 'feedback' && (
            <FeedbackPhase 
              trial={trial} 
              participantId={participant!.id}
              onComplete={handleTrialComplete}
            />
          )}
          
          {trial.phase === 'review' && (
            <ReviewPhase 
              trial={trial} 
              participantId={participant!.id}
              onComplete={handleTrialComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
