// 数据转换脚本 - 将 words_real.ts 转换为结构化格式
const fs = require('fs');
const path = require('path');

// 读取原始数据
const rawDataPath = path.join(__dirname, '../src/data/words_real_fixed.json');
let rawData = fs.readFileSync(rawDataPath, 'utf-8');

// 解析JSON数据
const dataArray = JSON.parse(rawData);

// 按 testType 分组
const testGroups = {
  test1: [],
  test2: [],
  test3: [],
  test4: []
};

dataArray.forEach(item => {
  const testType = item.testType;
  if (testType === 'test 1') {
    testGroups.test1.push(item);
  } else if (testType === 'test 2') {
    testGroups.test2.push(item);
  } else if (testType === 'test 3') {
    testGroups.test3.push(item);
  } else if (testType === 'test 4') {
    testGroups.test4.push(item);
  }
});

// 转换函数
function convertToTrialItem(item, testType) {
  return {
    testType: testType,
    order: parseInt(item.order),
    condition: item.condition,
    word: item.word,
    meaning: item.meaning,
    sentence: item.sentence,
    theme: item.theme,
    subOrder: parseInt(item.subOrder),
    notes: item.notes,
    isWarmup: false
  };
}

// 生成TypeScript文件
let output = `// 正式测试数据 (Test Questions)\nimport { TrialItem } from '@/types';\n\n`;

// 生成每个test的数据
['test1', 'test2', 'test3', 'test4'].forEach((testKey) => {
  const testName = testKey.toUpperCase();
  const trials = testGroups[testKey].map(item => convertToTrialItem(item, testKey));
  
  output += `// =====================================================\n`;
  output += `// ${testName} - ${trials.length} 题\n`;
  output += `// =====================================================\n`;
  output += `export const ${testName}_TRIALS: TrialItem[] = `;
  output += JSON.stringify(trials, null, 2);
  output += ';\n\n';
});

// 写入文件
const outputPath = path.join(__dirname, '../src/data/testData.ts');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('✅ 数据转换完成！');
console.log(`TEST1: ${testGroups.test1.length} 题`);
console.log(`TEST2: ${testGroups.test2.length} 题`);
console.log(`TEST3: ${testGroups.test3.length} 题`);
console.log(`TEST4: ${testGroups.test4.length} 题`);
