// 单字拼音转换后的结果
export interface SingleWordResult {
  origin: string;
  result: string;
  isZh: boolean;
  originPinyin: string;
  delete?: boolean;
}

export interface MapResultItem extends SingleWordResult {
  pinyin: string;
  num: string;
}

// toneType 属性可选参数
export type ToneType = 'symbol' | 'num' | 'none';

export type PinyinMode = 'normal' | 'surname';
