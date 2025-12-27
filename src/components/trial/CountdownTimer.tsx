'use client';

import { useEffect, useState, useCallback } from 'react';

interface CountdownTimerProps {
  duration: number; // 秒数
  onComplete: () => void;
  isPaused?: boolean;
}

export function CountdownTimer({ duration, onComplete, isPaused = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete, isPaused]);

  // 计算进度百分比
  const progress = (timeLeft / duration) * 100;
  
  // 颜色变化：剩余5秒变红
  const isWarning = timeLeft <= 5;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
      <div className="flex flex-col items-end gap-1">
        {/* 时间数字 */}
        <div 
          className={`text-lg font-medium tabular-nums transition-colors ${
            isWarning ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          残り時間 {timeLeft}秒
        </div>
        
        {/* 说明文字 */}
        <div className="text-xs text-gray-500 max-w-[200px] text-right">
          残り時間が終了すると、自動的に次のページへ進みます。
        </div>
        
        {/* 进度条 */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isWarning ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
