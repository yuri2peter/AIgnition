// 项目名
export const PROJECT_NAME = 'AIgnition';

// 应用名
export const APP_NAME = 'AIgnition';

// 是否mac
export const IS_MAC = process.platform === 'darwin';

// 是否win
export const IS_WIN = process.platform === 'win32';

// 是否开发模式
export const IS_DEV = process.env.NODE_ENV === 'development';

// 开发渲染端口
export const DEV_RENDERER_PORT = 8000;

// 服务端口，如果为0，系统会随机选择
export const SERVER_PORT = IS_DEV
  ? 3000
  : Number(process.env.SERVER_PORT || '0');

// chii 调试工具端口
export const CHII_PORT = 8080;

// 服务端是否跨域
export const USE_CORS = false;

// 上传文件(DANGER)最大限制, 1024 * 1024 * 1024 表示 1G
export const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 1024;

// 上传文件访问前缀
export const UPLOADS_URL_PREFIX = '/uploads';

// 开发渲染时不限制host(DANGER)
export const DEV_RENDERER_ALLOWED_ALL_HOSTS = true;

// 启用CHII调试器
export const USE_CHII = false;

// 启用web server
export const USE_WEB_SERVER = true;

// 启用socket（需要启动web server）
export const USE_SOCKET = false && USE_WEB_SERVER;

// 启用electron
export const USE_ELECTRON = false;

// 服务端启动后是否自动打开浏览器
export const OPEN_BROWSER_AFTER_WEB_SERVER_START =
  true && !USE_ELECTRON && USE_WEB_SERVER && IS_WIN && !IS_DEV;

// 前端web开发时是否自动打开浏览器
export const OPEN_BROWSER_AFTER_WEB_DEV_START =
  false && IS_DEV && IS_WIN && !USE_ELECTRON;

// 前端web开发时是否自动打开CHII
export const OPEN_CHII_AFTER_WEB_DEV_START =
  false && USE_CHII && IS_DEV && IS_WIN;

// auth
export const AUTH_TOKEN_NAME = 'auth_token';
export const TOKEN_MAX_AGE = 7 * 24 * 3600 * 1000; // TOKEN过期时间为7天
