// Zustand 状态管理 - 实验进度和答题记录（集成 Supabase）
import { create } from 'zustand';
import { Response, Participant, ParticipantStatus, TestType } from '@/types';
import { supabase } from '@/lib/supabase';
import { assignTestType, getProgressInfo } from '@/data/dataService';

interface ExperimentState {
  // 当前参与者
  participant: Participant | null;
  
  // 答题记录
  responses: Response[];
  
  // Actions
  login: (participantCode: string, studentName: string) => void;
  logout: () => void;
  addResponse: (response: Omit<Response, 'id'>) => void;
  nextTrial: () => void;
  completeExperiment: () => void;
  completeWarmup: () => void;
  
  // Getters
  getCurrentTrialIndex: () => number;
  isCompleted: () => boolean;
  isWarmupCompleted: () => boolean;
  getTestType: () => TestType;
}

export const useExperimentStore = create<ExperimentState>()((set, get) => ({
  participant: null,
  responses: [],

  login: async (participantCode: string, studentName: string) => {
    // 自动分配测试类型
    const testType = assignTestType(participantCode);
    
    // 检查 Supabase 中是否已存在该参与者
    const { data: existing } = await supabase
      .from('project11_participants')
      .select('*')
      .eq('participant_code', participantCode)
      .eq('status', 'in_progress')
      .single();

    if (existing) {
      // 恢复进度
      set({
        participant: {
          id: existing.id,
          participantCode: existing.participant_code,
          studentName: existing.student_name || studentName,
          testType: existing.test_type as TestType,
          sessionId: existing.id,
          startedAt: new Date(existing.started_at),
          completedAt: existing.completed_at ? new Date(existing.completed_at) : null,
          currentTrialIndex: existing.current_trial_index,
          status: existing.status as ParticipantStatus,
          isWarmupCompleted: existing.is_warmup_completed || false,
        },
        responses: [],
      });
      return;
    }

    // 创建新参与者
    const { data: newParticipant } = await supabase
      .from('project11_participants')
      .insert({
        participant_code: participantCode,
        student_name: studentName,
        test_type: testType,
        current_trial_index: 0,
        status: 'in_progress',
        is_warmup_completed: false,
      })
      .select()
      .single();

    if (newParticipant) {
      set({
        participant: {
          id: newParticipant.id,
          participantCode: newParticipant.participant_code,
          studentName: newParticipant.student_name,
          testType: newParticipant.test_type as TestType,
          sessionId: newParticipant.id,
          startedAt: new Date(newParticipant.started_at),
          completedAt: null,
          currentTrialIndex: 0,
          status: 'in_progress',
          isWarmupCompleted: false,
        },
        responses: [],
      });
    }
  },

  logout: () => {
    set({
      participant: null,
      responses: [],
    });
  },

  addResponse: async (responseData) => {
    const state = get();
    if (!state.participant) return;

    console.log('📝 addResponse 收到数据:', {
      isWarmup: responseData.isWarmup,
      word: responseData.wordText,
      answer: responseData.answerText,
      trialIndex: responseData.trialIndex
    });

    // 热身练习不保存到数据库
    if (responseData.isWarmup) {
      const response: Response = {
        ...responseData,
        id: `warmup-${Date.now()}`, // 临时ID，不会存入数据库
      };

      set((state) => ({
        responses: [...state.responses, response],
      }));
      console.log('✅ 热身题已保存到本地（不写数据库）');
      return;
    }

    console.log('💾 正式题，准备保存到数据库...');

    // 正式测试保存到 Supabase（包含新字段）
    const { data, error } = await supabase
      .from('project11_responses')
      .insert({
        participant_id: state.participant.id,
        trial_index: responseData.trialIndex,
        word_text: responseData.wordText,
        order_num: responseData.order,
        condition: responseData.condition,
        condition_label: responseData.conditionLabel,
        exposure_index: responseData.exposureIndex,
        phase: responseData.phase,
        sentence_text: responseData.sentenceText,
        correct_answer: responseData.correctAnswer,
        answer_text: responseData.answerText,
        is_submitted_by_timeout: responseData.isSubmittedByTimeout,
        shown_at: responseData.shownAt.toISOString(),
        submitted_at: responseData.submittedAt?.toISOString(),
        response_time_ms: responseData.responseTimeMs,
        // 新增字段
        theme: responseData.theme,
        sub_order: responseData.subOrder,
        notes: responseData.notes,
        is_warmup: responseData.isWarmup,
        test_type: responseData.testType,
        student_name: responseData.studentName,
        student_no: responseData.studentNo,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 数据库保存失败:', error);
      return;
    }

    if (data) {
      const response: Response = {
        ...responseData,
        id: data.id,
      };

      set((state) => ({
        responses: [...state.responses, response],
      }));
      
      console.log('✅ 数据库保存成功:', {
        id: data.id,
        answer: responseData.answerText
      });
    }
  },

  nextTrial: async () => {
    const state = get();
    if (!state.participant) return;

    const nextIndex = state.participant.currentTrialIndex + 1;

    // 更新 Supabase
    await supabase
      .from('project11_participants')
      .update({ current_trial_index: nextIndex })
      .eq('id', state.participant.id);

    set((state) => {
      if (!state.participant) return state;

      return {
        participant: {
          ...state.participant,
          currentTrialIndex: nextIndex,
        },
      };
    });
  },

  completeExperiment: async () => {
    const state = get();
    if (!state.participant) return;

    const completedAt = new Date();

    // 更新 Supabase
    await supabase
      .from('project11_participants')
      .update({
        completed_at: completedAt.toISOString(),
        status: 'completed',
      })
      .eq('id', state.participant.id);

    set((state) => {
      if (!state.participant) return state;

      return {
        participant: {
          ...state.participant,
          completedAt,
          status: 'completed' as ParticipantStatus,
        },
      };
    });
  },

  completeWarmup: async () => {
    const state = get();
    if (!state.participant) return;

    // 更新 Supabase
    await supabase
      .from('project11_participants')
      .update({
        is_warmup_completed: true,
      })
      .eq('id', state.participant.id);

    set((state) => {
      if (!state.participant) return state;

      return {
        participant: {
          ...state.participant,
          isWarmupCompleted: true,
        },
      };
    });
  },

  getCurrentTrialIndex: () => {
    const state = get();
    return state.participant?.currentTrialIndex ?? 0;
  },

  isCompleted: () => {
    const state = get();
    if (!state.participant) return false;
    
    const progressInfo = getProgressInfo(
      state.participant.currentTrialIndex,
      state.participant.testType
    );
    
    return state.participant?.status === 'completed' || 
           state.participant.currentTrialIndex >= progressInfo.totalTrials;
  },

  isWarmupCompleted: () => {
    const state = get();
    return state.participant?.isWarmupCompleted ?? false;
  },

  getTestType: () => {
    const state = get();
    return state.participant?.testType ?? 'test1';
  },
}));
