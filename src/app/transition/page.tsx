'use client';

import { useRouter } from 'next/navigation';

export default function TransitionPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/trial');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full">
        {/* 完成图标 */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          練習完了
        </h1>

        {/* 说明文案 */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <p className="text-xl text-center text-gray-700 mb-6">
            以上で練習は終了です。
          </p>
          <p className="text-xl text-center text-gray-700">
            これより本課題を開始します。
          </p>
        </div>

        {/* 注意事项 */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-8 border border-yellow-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            注意事項
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>本課題では100問の単語学習を行います</li>
            <li>各問題は制限時間があり ます</li>
            <li>途中で中断することはできませんので、ご注意ください</li>
          </ul>
        </div>

        {/* 开始按钮 */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-12 py-4 bg-blue-600 text-white text-xl rounded-lg 
                       hover:bg-blue-700 transition-colors shadow-lg font-medium"
          >
            スタート
          </button>
        </div>
      </div>
    </div>
  );
}
