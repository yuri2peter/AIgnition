import dayjs from 'dayjs';

// 等待
export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 获取当前时间的总秒数
export function getCurrentTimeSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

export function formatTime(
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'YYYY-MM-DD HH:mm'
) {
  return dayjs(date).format(format);
}
