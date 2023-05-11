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
export type ToneType = 'symbol' | 'num' | 'none';
export type PinyinMode = 'normal' | 'surname';
