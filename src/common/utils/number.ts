// 返回一个在当前进程累加的ID。
let _generateId = 1;
export function generateId() {
  return _generateId++;
}

// 对于小于0的数,取0
export function getZeroIfLessThanZero(num: number) {
  return num < 0 ? 0 : num;
}

// 保留3位小数
export function fixNumber(num: number) {
  return Math.round(num * 1000) / 1000;
}

// 限制数字在某一范围内
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
