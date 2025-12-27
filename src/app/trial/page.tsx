'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';
import { getFullTrialSequence, getProgressInfo, isWarmupPhase } from '@/data/dataService';
import { Response, TrialItem, TestType } from '@/types';
import { TIMING } from '@/config/dev';

export default function TrialPage() {
  const router = useRouter();
  const { 
    participant, 
    addResponse, 
    nextTrial, 
    completeExperiment,
    completeWarmup,
    getCurrentTrialIndex,
    isCompleted,
    getTestType
  } = useExperimentStore();

  const [currentTrialIndex, setCurrentTrialIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trials, setTrials] = useState<TrialItem[]>([]);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'guess' | 'feedback' | null>(null); // 初始为null
  const [shownAt, setShownAt] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState(TIMING.GUESS_DURATION);
  
  // 使用 ref 防止重复提交 - 记录当前正在处理的 trialIndex 和 phase
  const processingRef = useRef<{trialIndex: number, phase: string} | null>(null);
  
  // 使用 Set 记录已保存到数据库的 trial（通过唯一key）
  const savedTrialsRef = useRef<Set<string>>(new Set());
  
  // 记录当前运行的 timer ID，用于清理旧 timer
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  
  // 使用 ref 来存储 handleTimeUp，避免倒计时重置
  const handleTimeUpRef = useRef<() => void>();

  // 客户端初始化
  useEffect(() => {
    if (!participant) {
      router.push('/');
      return;
    }

    if (isCompleted()) {
      router.push('/complete');
      return;
    }

    const testType = getTestType();
    const fullTrials = getFullTrialSequence(testType);
    const currentIndex = getCurrentTrialIndex();
    
    setTrials(fullTrials);
    setCurrentTrialIndex(currentIndex);
    
    // 检查当前题目是否为第5次呈现，如果是则直接设置为feedback阶段
    const currentTrial = fullTrials[currentIndex];
    if (currentTrial && currentTrial.subOrder === 5) {
      setPhase('feedback');
    } else {
      setPhase('guess');
    }
    
    setIsLoading(false);
  }, [participant, router, isCompleted, getCurrentTrialIndex, getTestType]);

  // 保存答题记录（仅正式题保存到数据库）
  const saveResponse = useCallback((isTimeout: boolean) => {
    if (!participant || currentTrialIndex === null || !trials[currentTrialIndex]) return;
    
    const trial = trials[currentTrialIndex];
    
    // warmup阶段不保存到数据库
    if (trial.isWarmup) {
      console.log('🔸 Warmup阶段，不保存到数据库');
      return;
    }
    
    // 生成唯一key，防止重复保存
    const saveKey = `${currentTrialIndex}-guess`;
    if (savedTrialsRef.current.has(saveKey)) {
      console.log('⚠️ 该trial的guess阶段已保存，跳过重复保存:', saveKey);
      return;
    }
    
    const submittedAt = new Date();
    const responseTimeMs = submittedAt.getTime() - shownAt.getTime();

    const response: Omit<Response, 'id'> = {
      participantId: participant.id,
      trialId: currentTrialIndex + 1,
      trialIndex: currentTrialIndex,
      wordId: currentTrialIndex + 1,
      wordText: trial.word,
      order: trial.order,
      condition: trial.condition,
      conditionLabel: `${trial.condition}${trial.subOrder}`,
      exposureIndex: trial.subOrder,
      phase: 'guess',
      sentenceText: trial.sentence,
      answerText: answer.trim() || '',
      correctAnswer: trial.meaning,
      isCorrect: null,
      isSubmittedByTimeout: isTimeout,
      theme: trial.theme,
      subOrder: trial.subOrder,
      notes: trial.notes,
      isWarmup: trial.isWarmup,
      testType: trial.testType,
      studentName: participant.studentName,
      studentNo: participant.participantCode,
      shownAt,
      submittedAt,
      responseTimeMs,
    };

    console.log('💾 保存答案到数据库:', {
      trialIndex: currentTrialIndex,
      order: trial.order,
      word: trial.word,
      answer: answer.trim(),
      isTimeout,
      saveKey
    });

    addResponse(response);
    // 标记已保存
    savedTrialsRef.current.add(saveKey);
  }, [participant, currentTrialIndex, trials, answer, shownAt, addResponse]);

  // 移动到下一题
  const moveToNextTrial = useCallback(() => {
    if (currentTrialIndex === null) return;
    
    const nextIndex = currentTrialIndex + 1;
    
    console.log('🔄 moveToNextTrial:', {
      currentIndex: currentTrialIndex,
      nextIndex,
      currentOrder: trials[currentTrialIndex]?.order,
      nextOrder: trials[nextIndex]?.order,
      nextSubOrder: trials[nextIndex]?.subOrder
    });
    
    // 检查是否刚完成warmup（跳转到过渡页面）
    if (currentTrialIndex < 5 && nextIndex >= 5) {
      nextTrial();
      completeWarmup();
      router.push('/transition');
      return;
    }
    
    // 检查是否完成所有题目
    if (nextIndex >= trials.length) {
      completeExperiment();
      router.push('/complete');
      return;
    }
    
    // 继续下一题
    nextTrial();
    setCurrentTrialIndex(nextIndex);
    
    // 检查下一题是否为第5次呈现，如果是则直接跳过guess阶段
    const nextTrialItem = trials[nextIndex];
    if (nextTrialItem && nextTrialItem.subOrder === 5) {
      console.log('⏭️ 下一题是第5次呈现(order=' + nextTrialItem.order + ')，直接进入feedback阶段');
      setPhase('feedback');
    } else {
      setPhase('guess');
    }
    
    setAnswer('');
    setShownAt(new Date());
    
    // 清除处理标记，允许新题目的处理
    processingRef.current = null;
  }, [currentTrialIndex, trials, nextTrial, completeExperiment, completeWarmup, router]);

  // 时间到处理
  const handleTimeUp = useCallback(() => {
    if (currentTrialIndex === null || !trials[currentTrialIndex] || phase === null) return;
    
    const trial = trials[currentTrialIndex];
    const isFifthExposure = trial.subOrder === 5;
    const currentPhase = phase;
    
    // 防止同一 trialIndex + phase 组合被重复处理
    const processingKey = `${currentTrialIndex}-${currentPhase}`;
    if (processingRef.current && 
        processingRef.current.trialIndex === currentTrialIndex && 
        processingRef.current.phase === currentPhase) {
      console.log('⚠️ 当前阶段已处理，跳过:', processingKey);
      return;
    }
    
    // 标记当前正在处理
    processingRef.current = { trialIndex: currentTrialIndex, phase: currentPhase };
    
    console.log('⏰ handleTimeUp:', {
      trialIndex: currentTrialIndex,
      order: trial.order,
      subOrder: trial.subOrder,
      phase: currentPhase,
      isWarmup: trial.isWarmup,
      isFifthExposure
    });
    
    if (currentPhase === 'guess') {
      // Guess阶段超时，保存答案（仅正式题）并进入feedback
      saveResponse(true);
      setPhase('feedback');
    } else if (currentPhase === 'feedback') {
      // Feedback阶段结束
      
      // 对于第5次呈现（subOrder=5），需要在这里保存记录（仅正式题）
      if (isFifthExposure && !trial.isWarmup) {
        // 生成唯一key，防止重复保存
        const saveKey = `${currentTrialIndex}-feedback`;
        
        if (savedTrialsRef.current.has(saveKey)) {
          console.log('⚠️ 该trial的feedback阶段已保存，跳过重复保存:', saveKey);
        } else {
          console.log('💾 第5次呈现(order=' + trial.order + ')，保存feedback记录');
          
          const submittedAt = new Date();
          const responseTimeMs = submittedAt.getTime() - shownAt.getTime();

          const response: Omit<Response, 'id'> = {
            participantId: participant!.id,
            trialId: currentTrialIndex + 1,
            trialIndex: currentTrialIndex,
            wordId: currentTrialIndex + 1,
            wordText: trial.word,
            order: trial.order,
            condition: trial.condition,
            conditionLabel: `${trial.condition}${trial.subOrder}`,
            exposureIndex: trial.subOrder,
            phase: 'feedback',
            sentenceText: trial.sentence,
            answerText: '',
            correctAnswer: trial.meaning,
            isCorrect: null,
            isSubmittedByTimeout: false,
            theme: trial.theme,
            subOrder: trial.subOrder,
            notes: trial.notes,
            isWarmup: trial.isWarmup,
            testType: trial.testType,
            studentName: participant!.studentName,
            studentNo: participant!.participantCode,
            shownAt,
            submittedAt,
            responseTimeMs,
          };

          addResponse(response);
          // 标记已保存
          savedTrialsRef.current.add(saveKey);
        }
      }
      
      // 移动到下一题
      moveToNextTrial();
    }
  }, [phase, currentTrialIndex, trials, participant, shownAt, saveResponse, moveToNextTrial, addResponse]);

  // 更新 handleTimeUpRef
  useEffect(() => {
    handleTimeUpRef.current = handleTimeUp;
  }, [handleTimeUp]);

  // 倒计时
  useEffect(() => {
    if (isLoading || currentTrialIndex === null || !trials[currentTrialIndex] || phase === null) return;
    
    const trial = trials[currentTrialIndex];
    const isFifthExposure = trial.subOrder === 5;
    
    // 清理旧的 timer（如果存在）
    if (timerIdRef.current) {
      console.log('🧹 清理旧timer');
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    
    // 第5次呈现使用配置的时间，否则根据阶段使用配置的时间
    const duration = isFifthExposure 
      ? TIMING.FIFTH_EXPOSURE_DURATION 
      : (phase === 'guess' ? TIMING.GUESS_DURATION : TIMING.FEEDBACK_DURATION);
    
    console.log('⏲️ 启动倒计时:', {
      trialIndex: currentTrialIndex,
      order: trial.order,
      phase,
      duration,
      isWarmup: trial.isWarmup
    });
    
    setTimeLeft(duration);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // 使用 ref 来调用 handleTimeUp，避免依赖变化导致倒计时重置
          handleTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 保存当前 timer ID
    timerIdRef.current = timer;

    return () => {
      clearInterval(timer);
      // 清理时重置 timerIdRef
      if (timerIdRef.current === timer) {
        timerIdRef.current = null;
      }
    };
  }, [currentTrialIndex, phase, isLoading, trials]);  // 移除了 handleTimeUp 依赖

  // 提交答案（用户主动提交）
  const handleSubmit = useCallback(() => {
    if (phase !== 'guess') return;
    
    // 检查是否已处理
    if (processingRef.current && 
        processingRef.current.trialIndex === currentTrialIndex && 
        processingRef.current.phase === 'guess') {
      return;
    }
    
    processingRef.current = { trialIndex: currentTrialIndex!, phase: 'guess' };
    saveResponse(false);
    setPhase('feedback');
  }, [phase, currentTrialIndex, saveResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phase === 'guess') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 加载中
  if (isLoading || currentTrialIndex === null || !trials[currentTrialIndex]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const trial = trials[currentTrialIndex];
  const progressInfo = getProgressInfo(currentTrialIndex, getTestType());
  const progress = ((currentTrialIndex + 1) / trials.length) * 100;
  
  // 检查是否为第5次呈现（特殊显示，不需要作答）
  const isFifthExposure = trial.subOrder === 5;

  // 高亮句子中的目标词
  const renderSentence = () => {
    const text = trial.sentence;
    const wordPattern = new RegExp(`\\(${trial.word}\\)`, 'g');
    const parts = text.split(wordPattern);
    
    return (
      <p className="text-xl leading-relaxed text-gray-800 font-english">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="font-bold text-blue-600 bg-blue-100 px-1 rounded">
                ({trial.word})
              </span>
            )}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部进度条 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {/* 前5题是热身，不显示进度；正式题显示進捗状況 */}
            {!progressInfo.isWarmup && (
              <span className="text-sm text-gray-600">
                進捗状況 {currentTrialIndex - 4}/100
              </span>
            )}
            {progressInfo.isWarmup && <span />}
            <div className="text-sm text-gray-600 text-right">
              <div className="font-mono font-bold text-base mb-1">
                残り時間 {timeLeft}秒
              </div>
              <div className="text-xs">
                残り時間が終了すると、自動的に次のページへ進みます。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {isFifthExposure ? (
            <>
              {/* 第5次呈现：只显示句子和释义，不需要作答 */}
              <div className="space-y-6">
                <p className="text-center text-gray-700 mb-4">
                  今回は解答は不要で、文と単語の意味のみが表示されます。
                </p>
                <p className="text-center text-gray-700 mb-6">
                  この単語とその意味をしっかり覚えてください。終了後に語彙テストがあります。
                </p>
                
                <div className="w-full bg-blue-50 rounded-lg p-6 border border-blue-200">
                  {renderSentence()}
                </div>
                
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {trial.meaning}
                  </p>
                </div>
              </div>
            </>
          ) : phase === 'guess' ? (
            <>
              {/* Guess 阶段 */}
              <div className="space-y-6">
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
                    解答は日本語でも英語でも構いません。
                  </p>
                </div>

                {/* 输入区域 */}
                <div className="w-full max-w-md mx-auto">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    解答欄
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Feedback 阶段 */}
              <div className="space-y-6">
                <p className="text-center text-gray-700">
                  この単語とその意味をしっかり覚えてください。終了後に語彙テストがあります。
                </p>
                
                <div className="w-full bg-green-50 rounded-lg p-6 border border-green-200">
                  {renderSentence()}
                </div>
                
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {trial.meaning}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 热身阶段显示"練習"文本 */}
        {progressInfo.isWarmup && (
          <div className="text-center mt-6">
            <p className="text-xl font-bold text-gray-600">練習</p>
          </div>
        )}
      </main>
    </div>
  );
}
