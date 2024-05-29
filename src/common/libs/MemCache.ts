const storage: {
  [key: string]: any;
} = {};

export default class MemCache {
  static EXPIRE_TIME = {
    ONE_HOUR: 3600,
    ONE_DAY: 86400,
    ONE_WEEK: 604800,
    ONE_MONTH: 2592000,
  };
  namespace: string;
  constructor(namespace = '') {
    this.namespace = namespace.replace(/\//g, '-');
  }
  /**
   * 设置一个缓存
   * @param key string 键名
   * @param value mixed 键值（可序列化的）
   * @param expire int 有效时间（单位：秒）
   * */
  set(key: string, value: any, expire = 0) {
    const path = this._getPath(key);
    const data = {
      key,
      value,
      expire,
      createAt: Date.now(),
    };
    storage[path] = data;
  }

  /**
   * 查询是否有一个有效缓存
   * @param key string 键名
   * @return boolean
   * */
  has(key: any) {
    const path = this._getPath(key);
    const data = storage[path];
    if (data === undefined) return false;
    try {
      if (
        data.expire === 0 ||
        data.expire * 1000 + data.createAt > Date.now()
      ) {
        return true;
      } else {
        this.remove(key);
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  /**
   * 获得一个缓存
   * @param key string 键名
   * @param defaultValue mixed 默认值
   * @return mixed
   * */
  get(key: string, defaultValue = undefined) {
    const path = this._getPath(key);
    const data = storage[path];
    if (data === undefined) return defaultValue;
    try {
      if (
        data.expire === 0 ||
        data.expire * 1000 + data.createAt > Date.now()
      ) {
        return data.value;
      } else {
        this.remove(key);
        return defaultValue;
      }
    } catch (e) {
      return defaultValue;
    }
  }

  /**
   * 获得并删除一个缓存
   * @param key string 键名
   * @param defaultValue mixed 默认值
   * @return mixed
   * */
  pop(key: string, defaultValue = undefined) {
    const result = this.get(key, defaultValue);
    this.remove(key);
    return result;
  }

  /**
   * 删除一个缓存
   * @param key string 键名
   * */
  remove(key: string) {
    const path = this._getPath(key);
    delete storage[path];
  }
  _getPath(key: string) {
    return `/${this.namespace}/${key}`;
  }
}
