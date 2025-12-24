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
    <div className="flex flex-col items-center gap-2">
      {/* 时间数字 */}
      <div 
        className={`text-4xl font-bold tabular-nums transition-colors ${
          isWarning ? 'text-red-500 animate-pulse' : 'text-gray-700'
        }`}
      >
        ⏱️ {timeLeft}s
      </div>
      
      {/* 进度条 */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isWarning ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
