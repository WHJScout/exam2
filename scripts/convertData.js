// 数据转换脚本 - 将 words_real.ts 转换为 testData.ts
const fs = require('fs');
const path = require('path');

// 读取 words_real.ts
const wordsRealPath = path.join(__dirname, '../src/data/words_real.ts');
const content = fs.readFileSync(wordsRealPath, 'utf-8');

// 解析JSON数组（words_real.ts本质上是一个JSON数组）
const rawData = eval(content);

// 分组
const test1 = [];
const test2 = [];
const test3 = [];
const test4 = [];

rawData.forEach(item => {
  const testType = item.testType.toLowerCase().replace(' ', '');
  const converted = {
    testType: testType,
    order: parseInt(item.order) || 0,
    condition: item.condition,
    word: item.word,
    meaning: item.meaning,
    sentence: item.sentence,
    theme: item.theme,
    subOrder: parseInt(item.subOrder) || 1,
    notes: item.notes || '',
    isWarmup: false
  };

  switch (testType) {
    case 'test1':
      test1.push(converted);
      break;
    case 'test2':
      test2.push(converted);
      break;
    case 'test3':
      test3.push(converted);
      break;
    case 'test4':
      test4.push(converted);
      break;
  }
});

// 生成 TypeScript 代码
const output = `// 正式测试数据 (Test Questions) - 自动生成
import { TrialItem } from '@/types';

// =====================================================
// TEST1 - ${test1.length} 题
// =====================================================
export const TEST1_TRIALS: TrialItem[] = ${JSON.stringify(test1, null, 2)};

// =====================================================
// TEST2 - ${test2.length} 题
// =====================================================
export const TEST2_TRIALS: TrialItem[] = ${JSON.stringify(test2, null, 2)};

// =====================================================
// TEST3 - ${test3.length} 题
// =====================================================
export const TEST3_TRIALS: TrialItem[] = ${JSON.stringify(test3, null, 2)};

// =====================================================
// TEST4 - ${test4.length} 题
// =====================================================
export const TEST4_TRIALS: TrialItem[] = ${JSON.stringify(test4, null, 2)};
`;

// 写入 testData.ts
const testDataPath = path.join(__dirname, '../src/data/testData.ts');
fs.writeFileSync(testDataPath, output);

console.log(`转换完成！`);
console.log(`TEST1: ${test1.length} 题`);
console.log(`TEST2: ${test2.length} 题`);
console.log(`TEST3: ${test3.length} 题`);
console.log(`TEST4: ${test4.length} 题`);
