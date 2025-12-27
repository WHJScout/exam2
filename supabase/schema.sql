-- =====================================================
-- 词汇学习实验系统 - Supabase 数据库 Schema (v3.1)
-- 版本: v3.1 (使用 public schema)
-- 日期: 2024-12-27
-- 说明: 支持热身题、4套test、学生姓名等新需求
-- =====================================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 删除现有表（如果存在）
-- =====================================================
DROP TABLE IF EXISTS project11_responses CASCADE;
DROP TABLE IF EXISTS project11_participants CASCADE;
DROP VIEW IF EXISTS project11_export_responses CASCADE;

-- =====================================================
-- 1. 参与者表 (project11_participants)
-- 存储学生信息和进度
-- =====================================================
CREATE TABLE project11_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_code VARCHAR(50) UNIQUE NOT NULL,  -- 学生编码，如 001, 002
    student_name VARCHAR(100),                      -- 新增：学生姓名
    test_type VARCHAR(20) NOT NULL,                 -- 新增：test1/test2/test3/test4
    is_warmup_completed BOOLEAN DEFAULT FALSE,      -- 新增：是否完成热身
    started_at TIMESTAMP DEFAULT NOW(),             -- 开始时间
    completed_at TIMESTAMP,                         -- 完成时间
    current_trial_index INT DEFAULT 0,              -- 当前进度
    status VARCHAR(20) DEFAULT 'in_progress',       -- 状态: in_progress, completed
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_project11_participants_code ON project11_participants(participant_code);
CREATE INDEX idx_project11_participants_status ON project11_participants(status);
CREATE INDEX idx_project11_participants_test_type ON project11_participants(test_type);

-- =====================================================
-- 2. 答题记录表 (project11_responses)
-- 记录每个学生的答题数据
-- =====================================================
CREATE TABLE project11_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES project11_participants(id) ON DELETE CASCADE,
    
    -- 题目信息
    trial_index INT NOT NULL,                      -- 全局顺序
    word_text VARCHAR(100) NOT NULL,               -- 词汇
    condition VARCHAR(20) NOT NULL,                -- massed/spaced
    condition_label VARCHAR(20) NOT NULL,          -- massed1, spaced3
    exposure_index INT NOT NULL,                   -- 第几次出现 1-5
    phase VARCHAR(20) NOT NULL,                    -- guess/feedback/review
    sentence_text TEXT,                            -- 句子内容
    correct_answer VARCHAR(200),                   -- 正确答案
    
    -- 新增字段
    theme VARCHAR(50),                             -- 主题（building/cooking等）
    sub_order INT,                                 -- 子顺序（1-5）
    notes VARCHAR(200),                            -- 备注
    is_warmup BOOLEAN DEFAULT FALSE,               -- 是否为热身题
    test_type VARCHAR(20),                         -- test类型
    student_name VARCHAR(100),                     -- 学生姓名
    student_no VARCHAR(50),                        -- 学生编号
    
    -- 学生答题数据
    answer_text TEXT,                              -- 学生答案
    is_submitted_by_timeout BOOLEAN DEFAULT FALSE, -- 是否超时
    
    -- 时间数据
    shown_at TIMESTAMP NOT NULL,                   -- 显示时间
    submitted_at TIMESTAMP,                        -- 提交时间
    response_time_ms INT,                          -- 反应时间（毫秒）
    
    -- 新增字段：答题顺序
    order_num INT,                                -- 答题顺序
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_project11_responses_participant ON project11_responses(participant_id);
CREATE INDEX idx_project11_responses_trial_index ON project11_responses(trial_index);
CREATE INDEX idx_project11_responses_word ON project11_responses(word_text);
CREATE INDEX idx_project11_responses_condition ON project11_responses(condition);
CREATE INDEX idx_project11_responses_test_type ON project11_responses(test_type);
CREATE INDEX idx_project11_responses_is_warmup ON project11_responses(is_warmup);
CREATE INDEX idx_project11_responses_order_num ON project11_responses(order_num);  -- 新增索引：答题顺序

-- =====================================================
-- 导出视图 (project11_export_responses)
-- 用于导出学生答题记录，包含所有必需字段
-- =====================================================
DROP VIEW IF EXISTS project11_export_responses CASCADE;

CREATE VIEW project11_export_responses AS
SELECT 
    p.participant_code AS student_no,     -- 学生编号
    p.student_name,                       -- 学生姓名
    p.test_type,                          -- test类型
    r.order_num,                          -- 顺序
    r.condition,                          -- massed/spaced
    r.word_text,                          -- 词汇
    r.correct_answer AS meaning,          -- 正确答案（meaning）
    r.sentence_text,                      -- 句子内容
    r.theme,                              -- 主题
    r.sub_order,                          -- 子顺序
    r.notes,                              -- 备注
    r.answer_text,                        -- 学生答案
    r.is_warmup,                          -- 是否为热身题
    r.trial_index,                        -- 全局顺序
    r.condition_label,                    -- massed1, spaced3
    r.exposure_index,                     -- 第几次出现 1-5
    r.phase,                              -- guess/feedback/review
    r.is_submitted_by_timeout,            -- 是否超时
    r.shown_at,                           -- 显示时间
    r.submitted_at,                       -- 提交时间
    p.id AS student_id,                   -- 新增：学生ID（用于区分重名学生）
    r.response_time_ms                    -- 反应时间（毫秒）
FROM project11_responses r
JOIN project11_participants p ON r.participant_id = p.id
ORDER BY p.participant_code, r.trial_index;

-- =====================================================
-- 注释
-- =====================================================
COMMENT ON TABLE project11_participants IS '学生信息表';
COMMENT ON TABLE project11_responses IS '答题记录表 - 导出Excel用';
COMMENT ON VIEW project11_export_responses IS '导出视图 - 直接SELECT * 即可';

-- =====================================================
-- 禁用 RLS（开发环境简化配置）
-- 如需安全访问控制，请启用 RLS 并配置策略
-- =====================================================
ALTER TABLE project11_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE project11_responses DISABLE ROW LEVEL SECURITY;
