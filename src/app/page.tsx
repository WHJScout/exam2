'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';

export default function HomePage() {
  const [participantCode, setParticipantCode] = useState('');
  const [studentName, setStudentName] = useState('');
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
    const name = studentName.trim();
    
    if (!code) {
      setError('参加者番号を入力してください');
      return;
    }

    // 验证编号格式：只允许 001-040
    const num = parseInt(code);
    if (isNaN(num) || num < 1 || num > 40) {
      setError('参加者番号は001～040の範囲内である必要があります');
      return;
    }

    // 确保是3位数格式（例：001）
    const formattedCode = String(num).padStart(3, '0');

    if (!name) {
      setError('名前を入力してください');
      return;
    }

    setIsLoading(true);
    
    try {
      // 登录并保存学生姓名
      await login(formattedCode, name);
      
      // 跳转到答题页面
      router.push('/trial');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました。もう一度お試しください。';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <h1 className="text-3xl font-bold mb-8 font-en">Vocabulary Learning Project</h1>

        {/* 説明 */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <ol className="list-decimal list-inside space-y-2 text-gray-800 font-ja">
            <li>これからいくつかの英語の文が提示されます。</li>
            <li>文中のかっこ「（ ）」内の単語の意味を推測し、解答欄に入力してください。</li>
            <li>推測の後に正しい意味が提示されます。単語とその意味をしっかり覚えてください。終了後に語彙テストがあります。</li>
            <li>所要時間は約45分です。</li>
          </ol>
        </div>

        {/* 分割線 */}
        <hr className="my-6 border-gray-300" />

        {/* 注意事項 */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <ul className="list-disc list-inside space-y-2 text-gray-800 font-ja">
            <li>研究実施中は研究に集中し、携帯電話は電源を切るか通知が来ない設定にしてカバンにしまってください。</li>
            <li>解答中はページを離れないようにしてください。</li>
            <li>「スタート」をクリックして開始してください。</li>
          </ul>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center gap-4 mb-4">
            <label 
              htmlFor="participantCode" 
              className="text-gray-800 whitespace-nowrap font-ja"
            >
              参加者番号（半角数字で入力）
            </label>
            <input
              id="participantCode"
              type="text"
              value={participantCode}
              onChange={(e) => {
                setParticipantCode(e.target.value);
                setError('');
              }}
              placeholder="例：001"
              className="flex-1 px-3 py-2 border border-gray-300 rounded font-ja
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label 
              htmlFor="participantName" 
              className="text-gray-800 whitespace-nowrap font-ja"
            >
              名前（漢字で入力）
            </label>
            <input
              id="participantName"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setError('');
              }}
              placeholder="例：広島太郎"
              className="flex-1 px-3 py-2 border border-gray-300 rounded font-ja
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600 font-ja">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded font-ja
                       hover:bg-blue-700 focus:ring-2 focus:ring-blue-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '読み込み中...' : 'スタート'}
          </button>
        </form>
      </div>
    </div>
  );
}
