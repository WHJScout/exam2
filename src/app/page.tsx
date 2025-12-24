'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';

export default function HomePage() {
  const [participantCode, setParticipantCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, participant } = useExperimentStore();

  // 如果已登录且未完成，自动跳转到实验页面
  useEffect(() => {
    if (participant && participant.status === 'in_progress') {
      router.push('/trial');
    }
  }, [participant, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = participantCode.trim();
    
    if (!code) {
      setError('请输入参与者编号');
      return;
    }

    // 简单验证：至少3个字符
    if (code.length < 3) {
      setError('参与者编号至少3个字符');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // 等待登录完成
      await login(code);
      
      // 登录成功后跳转
      router.push('/trial');
    } catch (err) {
      console.error('登录失败:', err);
      setError('登录失败，请检查网络连接或联系管理员');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
        {/* Logo/标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">词汇学习实验系统</h1>
          <p className="text-gray-500 mt-2">Vocabulary Learning Experiment</p>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <p className="font-medium mb-2">📋 实验说明：</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>本实验共180个学习步骤</li>
            <li>预计耗时45-60分钟</li>
            <li>请在安静环境下完成</li>
            <li>中途可暂停，下次登录可继续</li>
          </ul>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="participantCode" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              参与者编号
            </label>
            <input
              id="participantCode"
              type="text"
              value={participantCode}
              onChange={(e) => {
                setParticipantCode(e.target.value);
                setError('');
              }}
              placeholder="例如：STU001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         text-lg"
              autoComplete="off"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg
                       hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors text-lg"
          >
            {isLoading ? '正在登录...' : '开始实验'}
          </button>
        </form>

        {/* 底部信息 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          如有问题，请联系实验管理员
        </p>
      </div>
    </div>
  );
}
