// Zustand 状态管理 - 实验进度和答题记录（集成 Supabase）
import { create } from 'zustand';
import { Response, Participant, ParticipantStatus } from '@/types';
import { TOTAL_TRIALS } from '@/data/schedule';
import { supabase } from '@/lib/supabase';

interface ExperimentState {
  // 当前参与者
  participant: Participant | null;
  
  // 答题记录
  responses: Response[];
  
  // Actions
  login: (participantCode: string) => void;
  logout: () => void;
  addResponse: (response: Omit<Response, 'id'>) => void;
  nextTrial: () => void;
  completeExperiment: () => void;
  
  // Getters
  getCurrentTrialIndex: () => number;
  isCompleted: () => boolean;
}

export const useExperimentStore = create<ExperimentState>()((set, get) => ({
  participant: null,
  responses: [],

  login: async (participantCode: string) => {
    // 检查 Supabase 中是否已存在该参与者
    const { data: existing } = await supabase
      .from('participants')
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
          sessionId: existing.id,
          startedAt: new Date(existing.started_at),
          completedAt: existing.completed_at ? new Date(existing.completed_at) : null,
          currentTrialIndex: existing.current_trial_index,
          status: existing.status as ParticipantStatus,
        },
        responses: [],
      });
      return;
    }

    // 创建新参与者
    const { data: newParticipant } = await supabase
      .from('participants')
      .insert({
        participant_code: participantCode,
        current_trial_index: 0,
        status: 'in_progress',
      })
      .select()
      .single();

    if (newParticipant) {
      set({
        participant: {
          id: newParticipant.id,
          participantCode: newParticipant.participant_code,
          sessionId: newParticipant.id,
          startedAt: new Date(newParticipant.started_at),
          completedAt: null,
          currentTrialIndex: 0,
          status: 'in_progress',
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

    // 保存到 Supabase
    const { data } = await supabase
      .from('responses')
      .insert({
        participant_id: state.participant.id,
        trial_index: responseData.trialIndex,
        word_text: responseData.wordText,
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
      })
      .select()
      .single();

    if (data) {
      const response: Response = {
        ...responseData,
        id: data.id,
      };

      set((state) => ({
        responses: [...state.responses, response],
      }));
    }
  },

  nextTrial: async () => {
    const state = get();
    if (!state.participant) return;

    const nextIndex = state.participant.currentTrialIndex + 1;

    // 更新 Supabase
    await supabase
      .from('participants')
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
      .from('participants')
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

  getCurrentTrialIndex: () => {
    const state = get();
    return state.participant?.currentTrialIndex ?? 0;
  },

  isCompleted: () => {
    const state = get();
    return state.participant?.status === 'completed' || 
           (state.participant?.currentTrialIndex ?? 0) >= TOTAL_TRIALS;
  },
}));
