import path from 'path';
import puppeteer from 'puppeteer';
import { generateContentWithImage } from './ai';
import { sleep } from 'src/common/utils/time';
import { runtimeUploadsPath } from 'src/common/paths.app';
import { nanoid } from 'nanoid';
import { UPLOADS_URL_PREFIX } from 'src/common/config';
import db from 'src/server/data/db';

// parse url into title, description, icon, content
export async function urlParser2(url: string) {
  // console.log(puppeteer.executablePath());
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // avoid robot detect
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );
  await page.evaluateOnNewDocument(() => {
    // Disable WebGL
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    // Modify WebRTC
    const patchedRTCConfig = {
      iceServers: [{ urls: 'stun:stun.example.org' }],
    };
    Object.defineProperty(window, 'RTCConfiguration', {
      writable: false,
      value: patchedRTCConfig,
    });
  });
  // begin to read
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { timeout: 2000 }).catch(() => {
    console.warn(`Page ${url} too slow.`);
  });
  // wating for script running
  await sleep(500);

  // remove fixed element(ads, notifications, etc.)
  await page.evaluate(() => {
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const styles = window.getComputedStyle(elements[i]);
      const position = styles.getPropertyValue('position');
      const width = parseInt(styles.getPropertyValue('width'), 10);
      const height = parseInt(styles.getPropertyValue('height'), 10);

      if (position === 'fixed' && width > 800 && height > 600) {
        // @ts-ignore
        elements[i].style.opacity = 0;
      }
    }
  });

  // screenshot
  const screenshotFileName = `${nanoid()}.png`;
  const screenshotPath = path.resolve(runtimeUploadsPath, screenshotFileName);
  await page.screenshot({
    path: screenshotPath,
  });
  const title = await page.title();
  const description = await page
    .$eval('meta[name="description"]', (el) => el.content)
    .catch(() => {
      return 'No description.';
    });
  await browser.close();
  const prompt = [
    db().get().settings.bookmarkAnalysisTaskPrompt,
    JSON.stringify(
      {
        title,
        description,
      },
      null,
      2
    ),
  ].join('\n\n');
  const summary = await generateContentWithImage(prompt, screenshotPath).catch(
    (e) => {
      console.warn(e);
      return 'Content generated failed.';
    }
  );
  return {
    title,
    screenshot: UPLOADS_URL_PREFIX + '/' + screenshotFileName,
    summary,
    description,
  };
}
