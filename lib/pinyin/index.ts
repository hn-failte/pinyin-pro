import { getPinyinArray, getMultiplePinyinArray } from './handle';
import {
  validateType,
  middleWareNonZh,
  middlewareMultiple,
  middlewarePattern,
  middlewareToneType,
  middlewareV,
  middlewareType,
} from './middlewares';
import { SingleWordResult } from '../type';

interface BasicOptions {
  /**
   * @description 返回的拼音音调类型
   * @value symbol：在字母上加音调 （默认值）
   * @value num：以数字格式展示音调，并跟在拼音后面
   * @value none：不展示音调
   */
  toneType?: 'symbol' | 'num' | 'none';
  /**
   * @description 返回的拼音格式类型
   * @value pinyin：返回完整拼音 （默认值）
   * @value initial：返回声母
   * @value final：返回韵母
   * @value num：返回音调对应的数字
   * @value first：返回首字母
   * @value finalHead：返回韵头（介音）
   * @value finalBody：返回韵腹
   * @value finalTail：返回韵尾
   */
  pattern?:
    | 'pinyin'
    | 'initial'
    | 'final'
    | 'num'
    | 'first'
    | 'finalHead'
    | 'finalBody'
    | 'finalTail';
  /**
   * @description 是否返回单个汉字的所有多音，仅针对输入的 word 为单个汉字生效
   * @value false：返回最常用的一个拼音 （默认值）
   * @value true：返回所有读音
   */
  multiple?: boolean;
  /**
   * @description 优先的拼音匹配模式
   * @value normal：正常匹配模式 （默认值）
   * @value surname：姓氏模式，遇到姓氏表中的汉字时，优先匹配姓氏读音
   */
  mode?: 'normal' | 'surname';
  /**
   * @description 是否移除非汉字字符（推荐使用 removeNonZh: removed 代替）
   * @value false：返回结果保留非汉字字符 （默认值）
   * @value true：返回结果移除非汉字字符
   */
  removeNonZh?: boolean;
  /**
   * @description 非汉字字符的间距格式
   * @value spaced：连续非汉字字符之间用空格隔开 （默认值）
   * @value consecutive：连续非汉字字符无间距
   * @value removed：返回结果移除非汉字字符
   */
  nonZh?: 'spaced' | 'consecutive' | 'removed';
  /**
   * @description 对于 ü 的返回是否转换成 v（仅在 toneType: none 启用时生效）
   * @value false：返回值中保留 ü （默认值）
   * @value true：返回值中 ü 转换成 v
   */
  v?: boolean;
}

interface AllData {
  origin: string;
  pinyin: string;
  initial: string;
  final: string;
  num: number;
  first: string;
  finalHead: string;
  finalBody: string;
  finalTail: string;
  isZh: boolean;
}

interface OptionsReturnString extends BasicOptions {
  /**
   * @description 返回结果的格式
   * @value string：以字符串格式返回，拼音之间用空格隔开 （默认值）
   * @value array：以数组格式返回
   * @value array: 返回全部信息数组
   */
  type?: 'string';
}

interface OptionsReturnArray extends BasicOptions {
  /**
   * @description 返回结果的格式
   * @value string：以字符串格式返回，拼音之间用空格隔开 （默认值）
   * @value array：以数组格式返回
   * @value array: 返回全部信息数组
   */
  type: 'array';
}

interface OptionsReturnAll extends BasicOptions {
  /**
   * @description 返回结果的格式
   * @value string：以字符串格式返回，拼音之间用空格隔开 （默认值）
   * @value array：以数组格式返回
   * @value array: 返回全部信息数组
   */
  type: 'all';
}

export interface CompleteOptions extends BasicOptions {
  /**
   * @description 返回结果的格式
   * @value string：以字符串格式返回，拼音之间用空格隔开 （默认值）
   * @value array：以数组格式返回
   * @value array: 返回全部信息数组
   */
  type?: 'string' | 'array' | 'all';
}

const DEFAULT_OPTIONS: CompleteOptions = {
  pattern: 'pinyin',
  toneType: 'symbol',
  type: 'string',
  multiple: false,
  mode: 'normal',
  removeNonZh: false,
  nonZh: 'spaced',
  v: false,
};

/**
 * @description: 获取汉语字符串的拼音
 * @param {string} word 要转换的汉语字符串
 * @param {OptionsReturnString=} options 配置项
 * @return {string | string[] | AllData[]} options.type 为 string 时，返回字符串，中间用空格隔开；为 array 时，返回拼音字符串数组；为 all 时返回全部信息的数组
 */
function pinyin(word: string, options?: OptionsReturnString): string;

/**
 * @description: 获取汉语字符串的拼音
 * @param {string} word 要转换的汉语字符串
 * @param {OptionsReturnArray=} options 配置项
 * @return {string | string[] | AllData[]} options.type 为 string 时，返回字符串，中间用空格隔开；为 array 时，返回拼音字符串数组；为 all 时返回全部信息的数组
 */
function pinyin(word: string, options?: OptionsReturnArray): string[];

/**
 * @description: 获取汉语字符串的拼音
 * @param {string} word 要转换的汉语字符串
 * @param {OptionsReturnAll=} options 配置项
 * @return {string | string[] | AllData[]} options.type 为 string 时，返回字符串，中间用空格隔开；为 array 时，返回拼音字符串数组；为 all 时返回全部信息的数组
 */
function pinyin(word: string, options?: OptionsReturnAll): AllData[];

/**
 * @description: 获取汉语字符串的拼音
 * @param {string} word 要转换的汉语字符串
 * @param {CompleteOptions=} options 配置项
 * @return {string | string[] | AllData[]} options.type 为 string 时，返回字符串，中间用空格隔开；为 array 时，返回拼音字符串数组；为 all 时返回全部信息的数组
 */
function pinyin(
  word: string,
  options = DEFAULT_OPTIONS
): string | string[] | AllData[] {
  // 校验 word 类型是否正确
  const legal = validateType(word);
  if (!legal) {
    return word;
  }

  // 传入空字符串
  if (word === '') {
    return options.type === 'array' || options.type === 'all' ? [] : '';
  }

  if (options.type === 'all') {
    options.pattern = 'pinyin';
  }

  if (options.pattern === 'num') {
    options.toneType = 'none';
  }

  if (options.removeNonZh) {
    options.nonZh = 'removed';
  }

  let list = getPinyinArray(word, options.mode || 'normal');

  // nonZh 参数及 removeNonZh 参数
  list = middleWareNonZh(list, options);

  // multiple 参数
  if (middlewareMultiple(word, options)) {
    list = middlewareMultiple(word, options) as SingleWordResult[];
  }

  // pattern 参数
  middlewarePattern(list, options);

  // toneType参数处理
  middlewareToneType(list, options);

  // v参数处理
  middlewareV(list, options);

  // type 参数处理
  return middlewareType(list, options, word);
}

/**
 * @description: 获取汉语多音字字符串的拼音
 * @param {string} word 要转换的汉语字符串多音字
 * @param {{}=} options 配置项
 * @return {Array<Array<SingleWordResult>>} 返回包含多音字所有拼音数组的数组
 */
function multiplePinyin(word: string, options?: {}) {
  // 校验 word 类型是否正确
  const legal = validateType(word);
  if (!legal) {
    return word;
  }

  // 传入空字符串
  if (word === '') {
    return [];
  }

  let list = getMultiplePinyinArray(word);

  return list;
}

export { pinyin, multiplePinyin };
