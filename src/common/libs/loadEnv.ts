// https://github.com/grimen/node-env-file/blob/master/lib/index.js

import fs from 'fs';

export default function loadEnv(env_file: string) {
  const envs: Record<string, string> = {};
  if (fs.existsSync(env_file)) {
    let lines;

    try {
      lines = (fs.readFileSync(env_file, 'utf8') || '')
        .split(/\r?\n|\r/)
        .filter((line) => {
          return /\s*=\s*/i.test(line);
        })
        .map((line) => {
          return line.replace('exports ', '');
        });
    } catch (err) {
      throw new TypeError('Environment file could not be read: ' + err);
    }

    lines.forEach((line) => {
      const is_comment = /^\s*#/i.test(line); // ignore comment lines (starting with #).
      if (!is_comment) {
        const key_value = line.match(/^([^=]+)\s*=\s*(.*)$/);
        const env_key = key_value?.[1];
        // remove ' and " characters if right side of = is quoted
        const env_value = key_value?.[2]?.match(/^(['"]?)([^\n]*)\1$/m)?.[2];
        if (env_key) {
          envs[env_key] = env_value || '';
        }
      }
    });
  }

  // overwrite environment variables
  Object.assign(process.env, envs);
  return envs;
}
