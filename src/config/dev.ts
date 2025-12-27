// 开发环境配置
// 设置 DEV_MODE = true 启用开发模式（快速倒计时）
// 设置 DEV_MODE = false 使用正式时间

export const DEV_MODE = false; // 上线前改为 false

// 倒计时时间配置（秒）
export const TIMING = {
  // Guess 阶段时间（答题）
  GUESS_DURATION: DEV_MODE ? 3 : 20,
  
  // Feedback 阶段时间（显示答案）
  FEEDBACK_DURATION: DEV_MODE ? 2 : 5,
  
  // 第5次呈现时间（subOrder=5，只显示句子和答案，不需要作答）
  // 正式环境应为20秒（与notes中的"20秒句子和答案"一致）
  FIFTH_EXPOSURE_DURATION: DEV_MODE ? 2 : 20,
};
