'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';

export default function CompletePage() {
  const router = useRouter();
  const { participant } = useExperimentStore();

  useEffect(() => {
    // 如果没有登录，跳转到首页
    if (!participant) {
      router.push('/');
    }
  }, [participant, router]);

  if (!participant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
          {/* 成功图标 */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            実験完了！
          </h1>
          <p className="text-gray-600 mb-8">
            ご参加いただき、誠にありがとうございました。<br />
            結果をお待ちください。
          </p>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ご不明な点がございましたら、実験管理者までお問い合わせください
        </p>
      </div>
    </div>
  );
}
