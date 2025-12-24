// 模拟数据 - 20个词汇 (10 Massed + 10 Spaced)
import { Word, Sentence } from '@/types';

// =====================================================
// 词汇数据
// =====================================================
export const WORDS: Word[] = [
  // Massed 词汇 (M1-M10)
  { id: 1, wordText: 'narage', correctMeaning: 'mural', chineseMeaning: '壁画', condition: 'massed', conditionIndex: 1 },
  { id: 2, wordText: 'blinket', correctMeaning: 'blanket', chineseMeaning: '毯子', condition: 'massed', conditionIndex: 2 },
  { id: 3, wordText: 'crovine', correctMeaning: 'crown', chineseMeaning: '皇冠', condition: 'massed', conditionIndex: 3 },
  { id: 4, wordText: 'delphor', correctMeaning: 'dolphin', chineseMeaning: '海豚', condition: 'massed', conditionIndex: 4 },
  { id: 5, wordText: 'elmwood', correctMeaning: 'elm tree', chineseMeaning: '榆树', condition: 'massed', conditionIndex: 5 },
  { id: 6, wordText: 'frostil', correctMeaning: 'frost', chineseMeaning: '霜', condition: 'massed', conditionIndex: 6 },
  { id: 7, wordText: 'glinmer', correctMeaning: 'glimmer', chineseMeaning: '微光', condition: 'massed', conditionIndex: 7 },
  { id: 8, wordText: 'harblet', correctMeaning: 'harbor', chineseMeaning: '港口', condition: 'massed', conditionIndex: 8 },
  { id: 9, wordText: 'inkwell', correctMeaning: 'ink', chineseMeaning: '墨水', condition: 'massed', conditionIndex: 9 },
  { id: 10, wordText: 'jestorm', correctMeaning: 'jest', chineseMeaning: '玩笑', condition: 'massed', conditionIndex: 10 },
  
  // Spaced 词汇 (S1-S10)
  { id: 11, wordText: 'creptor', correctMeaning: 'merchant', chineseMeaning: '商人', condition: 'spaced', conditionIndex: 1 },
  { id: 12, wordText: 'luminar', correctMeaning: 'lantern', chineseMeaning: '灯笼', condition: 'spaced', conditionIndex: 2 },
  { id: 13, wordText: 'marvlex', correctMeaning: 'marble', chineseMeaning: '大理石', condition: 'spaced', conditionIndex: 3 },
  { id: 14, wordText: 'nocturn', correctMeaning: 'night owl', chineseMeaning: '夜猫子', condition: 'spaced', conditionIndex: 4 },
  { id: 15, wordText: 'orivant', correctMeaning: 'orient', chineseMeaning: '东方', condition: 'spaced', conditionIndex: 5 },
  { id: 16, wordText: 'plormen', correctMeaning: 'plumber', chineseMeaning: '水管工', condition: 'spaced', conditionIndex: 6 },
  { id: 17, wordText: 'quilver', correctMeaning: 'quiver', chineseMeaning: '箭袋', condition: 'spaced', conditionIndex: 7 },
  { id: 18, wordText: 'riftone', correctMeaning: 'rift', chineseMeaning: '裂缝', condition: 'spaced', conditionIndex: 8 },
  { id: 19, wordText: 'stormex', correctMeaning: 'storm', chineseMeaning: '暴风雨', condition: 'spaced', conditionIndex: 9 },
  { id: 20, wordText: 'trevlor', correctMeaning: 'traveler', chineseMeaning: '旅行者', condition: 'spaced', conditionIndex: 10 },
];

// =====================================================
// 句子数据 - 每个词4个句子
// =====================================================
export const SENTENCES: Sentence[] = [
  // M1: narage (mural)
  { id: 1, wordId: 1, sentenceIndex: 1, sentenceText: 'A group of volunteers painted a beautiful (narage) for a school playground.' },
  { id: 2, wordId: 1, sentenceIndex: 2, sentenceText: 'The room had walls covered with a (narage) illustrating a summer beach scene.' },
  { id: 3, wordId: 1, sentenceIndex: 3, sentenceText: 'The interior designer showed us the (narage) she selected for our dining room.' },
  { id: 4, wordId: 1, sentenceIndex: 4, sentenceText: 'A colorful (narage) covered the school wall, showing students playing and studying.' },

  // M2: blinket (blanket)
  { id: 5, wordId: 2, sentenceIndex: 1, sentenceText: 'She wrapped herself in a warm (blinket) on the cold winter night.' },
  { id: 6, wordId: 2, sentenceIndex: 2, sentenceText: 'The baby slept peacefully under a soft (blinket) in the crib.' },
  { id: 7, wordId: 2, sentenceIndex: 3, sentenceText: 'They spread a picnic (blinket) on the grass in the park.' },
  { id: 8, wordId: 2, sentenceIndex: 4, sentenceText: 'The hotel provided an extra (blinket) for the guests who felt cold.' },

  // M3: crovine (crown)
  { id: 9, wordId: 3, sentenceIndex: 1, sentenceText: 'The queen wore a golden (crovine) during the ceremony.' },
  { id: 10, wordId: 3, sentenceIndex: 2, sentenceText: 'The beauty pageant winner received a sparkling (crovine) on stage.' },
  { id: 11, wordId: 3, sentenceIndex: 3, sentenceText: 'The museum displayed an ancient (crovine) from the medieval era.' },
  { id: 12, wordId: 3, sentenceIndex: 4, sentenceText: 'The prince placed the royal (crovine) carefully on his head.' },

  // M4: delphor (dolphin)
  { id: 13, wordId: 4, sentenceIndex: 1, sentenceText: 'The children watched a (delphor) jump through the waves.' },
  { id: 14, wordId: 4, sentenceIndex: 2, sentenceText: 'A friendly (delphor) swam alongside our boat during the trip.' },
  { id: 15, wordId: 4, sentenceIndex: 3, sentenceText: 'The aquarium trainer taught the (delphor) amazing tricks.' },
  { id: 16, wordId: 4, sentenceIndex: 4, sentenceText: 'We spotted a (delphor) playing in the ocean near the shore.' },

  // M5: elmwood (elm tree)
  { id: 17, wordId: 5, sentenceIndex: 1, sentenceText: 'The old (elmwood) in our backyard provides wonderful shade.' },
  { id: 18, wordId: 5, sentenceIndex: 2, sentenceText: 'Birds built their nests in the tall (elmwood) by the river.' },
  { id: 19, wordId: 5, sentenceIndex: 3, sentenceText: 'The furniture was made from beautiful (elmwood) lumber.' },
  { id: 20, wordId: 5, sentenceIndex: 4, sentenceText: 'A massive (elmwood) stood at the entrance of the village.' },

  // M6: frostil (frost)
  { id: 21, wordId: 6, sentenceIndex: 1, sentenceText: 'The morning (frostil) covered the grass with a white layer.' },
  { id: 22, wordId: 6, sentenceIndex: 2, sentenceText: 'We scraped the (frostil) off the car windshield before driving.' },
  { id: 23, wordId: 6, sentenceIndex: 3, sentenceText: 'The windows had beautiful patterns of (frostil) in winter.' },
  { id: 24, wordId: 6, sentenceIndex: 4, sentenceText: 'The farmer worried about (frostil) damaging his crops.' },

  // M7: glinmer (glimmer)
  { id: 25, wordId: 7, sentenceIndex: 1, sentenceText: 'A (glinmer) of light appeared through the dark clouds.' },
  { id: 26, wordId: 7, sentenceIndex: 2, sentenceText: 'Her eyes showed a (glinmer) of hope when she heard the news.' },
  { id: 27, wordId: 7, sentenceIndex: 3, sentenceText: 'The diamond ring had a beautiful (glinmer) in the sunlight.' },
  { id: 28, wordId: 7, sentenceIndex: 4, sentenceText: 'We saw a faint (glinmer) from the distant lighthouse.' },

  // M8: harblet (harbor)
  { id: 29, wordId: 8, sentenceIndex: 1, sentenceText: 'The fishing boats returned to the (harblet) at sunset.' },
  { id: 30, wordId: 8, sentenceIndex: 2, sentenceText: 'The city built a new (harblet) for cruise ships.' },
  { id: 31, wordId: 8, sentenceIndex: 3, sentenceText: 'Sailors found shelter in the protected (harblet) during the storm.' },
  { id: 32, wordId: 8, sentenceIndex: 4, sentenceText: 'The busy (harblet) was full of ships from around the world.' },

  // M9: inkwell (ink)
  { id: 33, wordId: 9, sentenceIndex: 1, sentenceText: 'The writer dipped his pen into the (inkwell) to continue writing.' },
  { id: 34, wordId: 9, sentenceIndex: 2, sentenceText: 'She spilled (inkwell) all over her important documents.' },
  { id: 35, wordId: 9, sentenceIndex: 3, sentenceText: 'The calligrapher used special black (inkwell) for the artwork.' },
  { id: 36, wordId: 9, sentenceIndex: 4, sentenceText: 'The printer ran out of (inkwell) in the middle of the job.' },

  // M10: jestorm (jest)
  { id: 37, wordId: 10, sentenceIndex: 1, sentenceText: 'He made a (jestorm) that made everyone laugh at the party.' },
  { id: 38, wordId: 10, sentenceIndex: 2, sentenceText: 'The comedian was known for his clever (jestorm) on stage.' },
  { id: 39, wordId: 10, sentenceIndex: 3, sentenceText: 'She said it in (jestorm), but he took it seriously.' },
  { id: 40, wordId: 10, sentenceIndex: 4, sentenceText: 'The king enjoyed the (jestorm) from his court entertainer.' },

  // S1: creptor (merchant)
  { id: 41, wordId: 11, sentenceIndex: 1, sentenceText: 'The (creptor) sold exotic spices from distant lands.' },
  { id: 42, wordId: 11, sentenceIndex: 2, sentenceText: 'A wealthy (creptor) built the largest house in town.' },
  { id: 43, wordId: 11, sentenceIndex: 3, sentenceText: 'The (creptor) traveled by ship to trade goods overseas.' },
  { id: 44, wordId: 11, sentenceIndex: 4, sentenceText: 'Every morning, the (creptor) opened his shop at sunrise.' },

  // S2: luminar (lantern)
  { id: 45, wordId: 12, sentenceIndex: 1, sentenceText: 'The old (luminar) lit up the dark path through the forest.' },
  { id: 46, wordId: 12, sentenceIndex: 2, sentenceText: 'During the festival, they released floating (luminar) into the sky.' },
  { id: 47, wordId: 12, sentenceIndex: 3, sentenceText: 'He carried a paper (luminar) while walking at night.' },
  { id: 48, wordId: 12, sentenceIndex: 4, sentenceText: 'The street was decorated with colorful (luminar) for the holiday.' },

  // S3: marvlex (marble)
  { id: 49, wordId: 13, sentenceIndex: 1, sentenceText: 'The palace floor was made of white (marvlex) from Italy.' },
  { id: 50, wordId: 13, sentenceIndex: 2, sentenceText: 'The sculptor carved a beautiful statue from (marvlex).' },
  { id: 51, wordId: 13, sentenceIndex: 3, sentenceText: 'Children played with colorful glass (marvlex) in the yard.' },
  { id: 52, wordId: 13, sentenceIndex: 4, sentenceText: 'The countertop was polished (marvlex) that shone brightly.' },

  // S4: nocturn (night owl)
  { id: 53, wordId: 14, sentenceIndex: 1, sentenceText: 'She was a (nocturn) who preferred working after midnight.' },
  { id: 54, wordId: 14, sentenceIndex: 2, sentenceText: 'The cafe stayed open late for (nocturn) customers.' },
  { id: 55, wordId: 14, sentenceIndex: 3, sentenceText: 'As a (nocturn), he felt most creative during nighttime hours.' },
  { id: 56, wordId: 14, sentenceIndex: 4, sentenceText: 'The city never sleeps, perfect for (nocturn) like her.' },

  // S5: orivant (orient)
  { id: 57, wordId: 15, sentenceIndex: 1, sentenceText: 'Silk and tea were imported from the (orivant) long ago.' },
  { id: 58, wordId: 15, sentenceIndex: 2, sentenceText: 'The explorer traveled to the (orivant) seeking adventure.' },
  { id: 59, wordId: 15, sentenceIndex: 3, sentenceText: 'Beautiful porcelain came from the mysterious (orivant).' },
  { id: 60, wordId: 15, sentenceIndex: 4, sentenceText: 'The museum had a collection of art from the (orivant).' },

  // S6: plormen (plumber)
  { id: 61, wordId: 16, sentenceIndex: 1, sentenceText: 'We called the (plormen) to fix the leaking pipe.' },
  { id: 62, wordId: 16, sentenceIndex: 2, sentenceText: 'The (plormen) installed a new water heater for us.' },
  { id: 63, wordId: 16, sentenceIndex: 3, sentenceText: 'A skilled (plormen) can solve most household water problems.' },
  { id: 64, wordId: 16, sentenceIndex: 4, sentenceText: 'The (plormen) worked under the sink for two hours.' },

  // S7: quilver (quiver)
  { id: 65, wordId: 17, sentenceIndex: 1, sentenceText: 'The archer reached into his (quilver) for another arrow.' },
  { id: 66, wordId: 17, sentenceIndex: 2, sentenceText: 'The hunter carried a leather (quilver) on his back.' },
  { id: 67, wordId: 17, sentenceIndex: 3, sentenceText: 'The (quilver) was empty after the long battle.' },
  { id: 68, wordId: 17, sentenceIndex: 4, sentenceText: 'She decorated her (quilver) with beautiful feathers.' },

  // S8: riftone (rift)
  { id: 69, wordId: 18, sentenceIndex: 1, sentenceText: 'A deep (riftone) appeared in the earth after the earthquake.' },
  { id: 70, wordId: 18, sentenceIndex: 2, sentenceText: 'The (riftone) between the two friends grew wider over time.' },
  { id: 71, wordId: 18, sentenceIndex: 3, sentenceText: 'Scientists studied the (riftone) in the ocean floor.' },
  { id: 72, wordId: 18, sentenceIndex: 4, sentenceText: 'A (riftone) in the rock revealed ancient fossils inside.' },

  // S9: stormex (storm)
  { id: 73, wordId: 19, sentenceIndex: 1, sentenceText: 'The (stormex) knocked down trees across the entire city.' },
  { id: 74, wordId: 19, sentenceIndex: 2, sentenceText: 'We stayed indoors during the fierce (stormex) last night.' },
  { id: 75, wordId: 19, sentenceIndex: 3, sentenceText: 'The (stormex) brought heavy rain and strong winds.' },
  { id: 76, wordId: 19, sentenceIndex: 4, sentenceText: 'After the (stormex), a beautiful rainbow appeared in the sky.' },

  // S10: trevlor (traveler)
  { id: 77, wordId: 20, sentenceIndex: 1, sentenceText: 'The weary (trevlor) stopped at the inn for the night.' },
  { id: 78, wordId: 20, sentenceIndex: 2, sentenceText: 'A (trevlor) from far away shared stories of distant lands.' },
  { id: 79, wordId: 20, sentenceIndex: 3, sentenceText: 'The (trevlor) carried only a small bag on the journey.' },
  { id: 80, wordId: 20, sentenceIndex: 4, sentenceText: 'Every (trevlor) dreams of finding new places to explore.' },
];

// 帮助函数：根据词汇ID获取句子
export function getSentencesByWordId(wordId: number): Sentence[] {
  return SENTENCES.filter(s => s.wordId === wordId);
}

// 帮助函数：根据ID获取词汇
export function getWordById(id: number): Word | undefined {
  return WORDS.find(w => w.id === id);
}

// 帮助函数：获取条件标签
export function getConditionLabel(word: Word): string {
  return `${word.condition}${word.conditionIndex}`;
}
