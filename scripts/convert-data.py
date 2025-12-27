#!/usr/bin/env python3
import json
import sys

# 读取 words_real.ts
with open('../src/data/words_real.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修正JSON格式
content = content.replace('"test type":', '"testType":')
content = content.replace('"sub-order":', '"subOrder":')
content = content.replace('"student No.":', '"studentNo":')
content = content.replace('备注', 'notes')

# 解析JSON
data_array = json.loads(content)

print(f"总共读取 {len(data_array)} 条数据")

# 按testType分组
test_groups = {
    'test1': [],
    'test2': [],
    'test3': [],
    'test4': []
}

for item in data_array:
    test_type = item['testType']
    if test_type == 'test 1':
        test_groups['test1'].append(item)
    elif test_type == 'test 2':
        test_groups['test2'].append(item)
    elif test_type == 'test 3':
        test_groups['test3'].append(item)
    elif test_type == 'test 4':
        test_groups['test4'].append(item)

# 输出统计
for key, items in test_groups.items():
    print(f"{key.upper()}: {len(items)} 题")

# 生成TypeScript文件
output = """// 正式测试数据 (Test Questions)
import { TrialItem } from '@/types';

"""

def convert_item(item, test_type):
    return {
        'testType': test_type,
        'order': int(item['order']),
        'condition': item['condition'],
        'word': item['word'],
        'meaning': item['meaning'],
        'sentence': item['sentence'],
        'theme': item['theme'],
        'subOrder': int(item['subOrder']),
        'notes': item['notes'],
        'isWarmup': False
    }

for test_key in ['test1', 'test2', 'test3', 'test4']:
    test_name = test_key.upper()
    trials = [convert_item(item, test_key) for item in test_groups[test_key]]
    
    output += f"// =====================================================\n"
    output += f"// {test_name} - {len(trials)} 题\n"
    output += f"// =====================================================\n"
    output += f"export const {test_name}_TRIALS: TrialItem[] = "
    output += json.dumps(trials, ensure_ascii=False, indent=2)
    output += ";\n\n"

# 写入文件
with open('../src/data/testData.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print("\n✅ 数据转换完成！文件已保存到: testData.ts")
