-- =====================================================
-- 词汇学习实验系统 - Supabase 数据库 Schema (简化版)
-- 版本: v2.0 (简化版 - 考题在代码中)
-- 日期: 2024-12-24
-- 说明: 只存储学生数据，考题数据在代码中维护
-- =====================================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 参与者表 (participants)
-- 存储学生信息和进度
-- =====================================================
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_code VARCHAR(50) UNIQUE NOT NULL,  -- 学生编码，如 STU001
    started_at TIMESTAMP DEFAULT NOW(),            -- 开始时间
    completed_at TIMESTAMP,                        -- 完成时间
    current_trial_index INT DEFAULT 0,             -- 当前进度（0-179）
    status VARCHAR(20) DEFAULT 'in_progress',      -- 状态: in_progress, completed
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_participants_code ON participants(participant_code);
CREATE INDEX idx_participants_status ON participants(status);

-- =====================================================
-- 2. 答题记录表 (responses)
-- 记录每个学生的答题数据
-- =====================================================
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    
    -- 题目信息
    trial_index INT NOT NULL,                      -- 全局顺序 0-179
    word_text VARCHAR(100) NOT NULL,               -- 词汇
    condition VARCHAR(20) NOT NULL,                -- massed/spaced
    condition_label VARCHAR(20) NOT NULL,          -- massed1, spaced3
    exposure_index INT NOT NULL,                   -- 第几次出现 1-5
    phase VARCHAR(20) NOT NULL,                    -- guess/feedback/review
    sentence_text TEXT,                            -- 句子内容
    correct_answer VARCHAR(200),                   -- 正确答案
    
    -- 学生答题数据
    answer_text TEXT,                              -- 学生答案
    is_submitted_by_timeout BOOLEAN DEFAULT FALSE, -- 是否超时
    
    -- 时间数据
    shown_at TIMESTAMP NOT NULL,                   -- 显示时间
    submitted_at TIMESTAMP,                        -- 提交时间
    response_time_ms INT,                          -- 反应时间（毫秒）
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_responses_participant ON responses(participant_id);
CREATE INDEX idx_responses_trial_index ON responses(trial_index);
CREATE INDEX idx_responses_word ON responses(word_text);
CREATE INDEX idx_responses_condition ON responses(condition);

-- =====================================================
-- 导出视图
-- =====================================================
CREATE VIEW export_responses AS
SELECT 
    p.participant_code,
    r.trial_index,
    r.word_text,
    r.condition,
    r.condition_label,
    r.exposure_index,
    r.phase,
    r.sentence_text,
    r.answer_text,
    r.correct_answer,
    r.is_submitted_by_timeout,
    r.shown_at,
    r.submitted_at,
    r.response_time_ms
FROM responses r
JOIN participants p ON r.participant_id = p.id
ORDER BY p.participant_code, r.trial_index;

-- =====================================================
-- 注释
-- =====================================================
COMMENT ON TABLE participants IS '学生信息表';
COMMENT ON TABLE responses IS '答题记录表 - 导出Excel用';
COMMENT ON VIEW export_responses IS '导出视图 - 直接SELECT * 即可';
