# 📚 词汇学习实验系统 MVP

基于 Next.js 14 的词汇学习实验系统最小可行产品。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 📁 项目结构

```
vocabulary-learning-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 登录页面
│   │   ├── trial/page.tsx      # 答题页面
│   │   ├── complete/page.tsx   # 完成页面
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css         # 全局样式
│   ├── components/
│   │   └── trial/              # 答题组件
│   │       ├── CountdownTimer.tsx  # 倒计时
│   │       ├── GuessPhase.tsx      # 猜测阶段
│   │       ├── FeedbackPhase.tsx   # 反馈阶段
│   │       └── ReviewPhase.tsx     # 复习阶段
│   ├── data/
│   │   ├── words.ts            # 模拟词汇数据（20个词+80个句子）
│   │   └── schedule.ts         # 排程生成（180个trial）
│   ├── store/
│   │   └── experiment.ts       # Zustand状态管理
│   └── types/
│       └── index.ts            # TypeScript类型定义
├── supabase/
│   └── schema.sql              # ⭐ 数据库Schema（用于云端创建）
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🗄️ 数据库字段说明

### 1. participants（参与者表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| participant_code | VARCHAR(50) | 学生编码，如 STU001 |
| session_id | VARCHAR(50) | 会话ID |
| started_at | TIMESTAMP | 开始时间 |
| completed_at | TIMESTAMP | 完成时间 |
| current_trial_index | INT | 当前进度（0-179） |
| status | VARCHAR(20) | 状态: in_progress/completed/abandoned |

### 2. words（词汇表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| word_text | VARCHAR(100) | 伪词，如 narage |
| correct_meaning | VARCHAR(200) | 英文含义，如 mural |
| chinese_meaning | VARCHAR(200) | 中文含义，如 壁画 |
| condition | VARCHAR(20) | 条件: massed 或 spaced |
| condition_index | INT | 条件内编号 1-10 |

### 3. sentences（句子表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| word_id | INT | 关联词汇ID |
| sentence_index | INT | 句子编号 1-4 |
| sentence_text | TEXT | 句子内容 |

### 4. schedule_trials（排程表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| trial_index | INT | 全局顺序 0-179 |
| word_id | INT | 关联词汇ID |
| exposure_index | INT | 第几次出现 1-5 |
| phase | VARCHAR(20) | 阶段: guess/feedback/review |
| sentence_id | INT | 关联句子ID（review为NULL） |
| duration_seconds | INT | 时长: 20/5/15 |
| block_id | INT | 所属轮次 1-10 |

### 5. responses（答题记录表）⭐ 核心数据
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| participant_id | UUID | 参与者ID |
| trial_id | INT | 排程ID |
| trial_index | INT | 全局顺序 |
| word_id | INT | 词汇ID |
| word_text | VARCHAR(100) | 词汇文本（冗余） |
| condition | VARCHAR(20) | massed/spaced |
| condition_label | VARCHAR(20) | massed1, spaced3 等 |
| exposure_index | INT | 第几次出现 |
| phase | VARCHAR(20) | guess/feedback/review |
| sentence_text | TEXT | 句子内容 |
| answer_text | TEXT | 学生答案（仅guess） |
| correct_answer | VARCHAR(200) | 正确答案 |
| is_correct | BOOLEAN | 是否正确（人工判断） |
| is_submitted_by_timeout | BOOLEAN | 是否超时提交 |
| shown_at | TIMESTAMP | 题目显示时间 |
| submitted_at | TIMESTAMP | 提交时间 |
| response_time_ms | INT | 反应时间（毫秒） |

## 🎯 MVP功能

### ✅ 已实现
- [x] 学生登录（输入参与者编号）
- [x] 180个Trial完整流程
- [x] 三种阶段界面（Guess/Feedback/Review）
- [x] 倒计时功能（20s/5s/15s）
- [x] 超时自动提交
- [x] 进度保存（LocalStorage）
- [x] 断线恢复（同编号可继续）
- [x] 完成统计
- [x] CSV/JSON数据导出

### ⏳ 待实现（连接Supabase后）
- [ ] 数据云端存储
- [ ] 实时同步
- [ ] 管理后台
- [ ] 多人并发
- [ ] Excel导出

## 📊 实验流程

```
轮1: M1(9个trial) → S1-S5各第1次(10个trial) = 19个trial
轮2: M2(9个trial) → S6-S10各第1次(10个trial) = 19个trial
轮3: M3(9个trial) → S1-S5各第2次(10个trial) = 19个trial
...
轮9: M9(9个trial) → S1-S5各第5次/review(5个trial) = 14个trial
轮10: M10(9个trial) → S6-S10各第5次/review(5个trial) = 14个trial

总计: 8×19 + 2×14 = 180个trial
```

## 🔧 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand（带持久化）
- **数据**: 本地模拟（可迁移至Supabase）

## 📝 后续步骤

1. **创建Supabase项目**
   - 复制 `supabase/schema.sql` 到SQL编辑器执行
   
2. **配置环境变量**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **替换本地存储为Supabase**
   - 安装 `@supabase/supabase-js`
   - 修改 store/experiment.ts 使用Supabase

4. **部署到Vercel**
   - 连接GitHub仓库
   - 配置环境变量
   - 自动部署
