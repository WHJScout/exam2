'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExperimentStore } from '@/store/experiment';
import { TOTAL_TRIALS } from '@/data/schedule';

export default function CompletePage() {
  const router = useRouter();
  const { participant, responses, logout } = useExperimentStore();
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    // 如果没有登录，跳转到首页
    if (!participant) {
      router.push('/');
    }
  }, [participant, router]);

  // 导出数据为JSON（用于调试/备份）
  const handleExportData = () => {
    const data = {
      participant,
      responses,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment_${participant?.participantCode}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导出数据为CSV
  const handleExportCSV = () => {
    if (!responses.length) return;

    const headers = [
      'participant_code',
      'trial_index',
      'word_text',
      'condition',
      'condition_label',
      'exposure_index',
      'phase',
      'sentence_text',
      'answer_text',
      'correct_answer',
      'is_submitted_by_timeout',
      'shown_at',
      'submitted_at',
      'response_time_ms'
    ];

    const rows = responses.map(r => [
      participant?.participantCode || '',
      r.trialIndex,
      r.wordText,
      r.condition,
      r.conditionLabel,
      r.exposureIndex,
      r.phase,
      `"${(r.sentenceText || '').replace(/"/g, '""')}"`,
      `"${(r.answerText || '').replace(/"/g, '""')}"`,
      `"${r.correctAnswer.replace(/"/g, '""')}"`,
      r.isSubmittedByTimeout,
      r.shownAt.toISOString(),
      r.submittedAt?.toISOString() || '',
      r.responseTimeMs || ''
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment_${participant?.participantCode}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewSession = () => {
    logout();
    router.push('/');
  };

  if (!participant) {
    return null;
  }

  // 统计数据
  const guessResponses = responses.filter(r => r.phase === 'guess');
  const timeoutCount = guessResponses.filter(r => r.isSubmittedByTimeout).length;
  const avgResponseTime = guessResponses.length > 0
    ? Math.round(guessResponses.reduce((sum, r) => sum + (r.responseTimeMs || 0), 0) / guessResponses.length / 1000)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
          {/* 成功图标 */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            实验完成！
          </h1>
          <p className="text-gray-600 mb-8">
            感谢您参与本次词汇学习实验
          </p>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">{responses.length}</p>
              <p className="text-sm text-gray-600">总答题数</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-purple-600">{avgResponseTime}s</p>
              <p className="text-sm text-gray-600">平均用时</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-orange-600">{timeoutCount}</p>
              <p className="text-sm text-gray-600">超时次数</p>
            </div>
          </div>

          {/* 参与者信息 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-medium">参与者编号：</span>
              {participant.participantCode}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">开始时间：</span>
              {participant.startedAt.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">完成时间：</span>
              {participant.completedAt?.toLocaleString() || new Date().toLocaleString()}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg
                         hover:bg-green-700 transition-colors"
            >
              📥 导出数据 (CSV)
            </button>
            
            <button
              onClick={handleExportData}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 transition-colors"
            >
              📥 导出数据 (JSON)
            </button>

            <button
              onClick={() => setShowData(!showData)}
              className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-lg
                         hover:bg-gray-300 transition-colors"
            >
              {showData ? '隐藏数据' : '查看原始数据'}
            </button>

            <button
              onClick={handleNewSession}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg
                         hover:bg-gray-50 transition-colors"
            >
              开始新会话
            </button>
          </div>

          {/* 原始数据预览 */}
          {showData && (
            <div className="mt-6 text-left">
              <h3 className="font-medium text-gray-700 mb-2">原始数据预览（前10条）：</h3>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-auto max-h-96 text-xs font-mono">
                <pre>
                  {JSON.stringify(responses.slice(0, 10), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          如有问题，请联系实验管理员
        </p>
      </div>
    </div>
  );
}
