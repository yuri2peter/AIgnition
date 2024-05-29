import md5 from 'md5';

// 检查字符串是否是以某些字符开头,支持传入除外列表
// 如 startsWith('abc', ['a']) === true
// 但是 startsWith('abc', ['a'], ['ab']) === false
export function startsWith(
  str: string,
  checkList: string[],
  excludeList: string[] = []
) {
  const inList = (list: string[]) => {
    return list.some((item) => {
      return str.startsWith(item);
    });
  };
  return inList(checkList) && !inList(excludeList);
}

// 获取随机字符串，可指定长度
export function getRandomString(length = 8) {
  return md5(Math.random().toString(36)).substring(0, length);
}

// 连字符转驼峰
export function hyphen2Camel(str: string) {
  const re = /-(\w)/g;
  return str.replace(re, ($0, $1) => {
    return $1.toUpperCase();
  });
}

// 首字母改为大写
export function upperCaseFirst(str: string) {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.slice(1, str.length);
}

// 字节加单位
export function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// 仿windows重命名，如果有重复项，自动添加序号。ABC，ABC(1)，ABC(2)...
export function autoRenameWithIndex(newName: string, localNames: string[]) {
  const reg = /([\w\W]*)\((\d+)\)$/;
  const r1 = reg.exec(newName);
  const pureName1 = r1?.[1] || newName;
  let maxIndex = 0;
  localNames.forEach((t) => {
    const r2 = reg.exec(t);
    const pureName2 = r2?.[1] || t;
    let index2 = 0;
    if (pureName2 === pureName1) {
      index2 = Number(r2?.[2] || 0) + 1;
    }
    if (index2 > maxIndex) {
      maxIndex = index2;
    }
  });
  const index1 = maxIndex + 1;
  return index1 > 1 ? `${pureName1}(${index1 - 1})` : pureName1;
}
