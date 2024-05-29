import axios from 'axios';
import { load } from 'cheerio';
import { z } from 'zod';
import { generateContent } from './ai';

export async function snapshotReader(url: string) {
  try {
    const { data } = await axios.get('https://r.jina.ai/' + url);
    return data.split('Markdown Content:\n')[1] as string;
  } catch (error) {
    return 'No content.';
  }
}

export async function metaReader(url: string) {
  const html = await htmlReader(url);
  const $ = load(html);
  const title = $('title').text() || 'No Title';
  const description =
    $('meta[name="description" i]').attr('content') || 'No description.';
  const IconWorldWww =
    $('link[rel="icon" i], link[rel="shortcut icon" i]').attr('href') || '';
  return z
    .object({
      description: z.string(),
      title: z.string(),
      IconWorldWww: z.string(),
    })
    .parse({
      title,
      description,
      IconWorldWww,
    });
}

async function htmlReader(url: string) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,cn;q=0.9',
      },
    });
    return html as string;
  } catch (error) {
    const u = new URL(url);
    return `<title>${u.hostname}</title>`;
  }
}

// parse url into title, description, icon, content
export async function urlParser1(url: string) {
  // const [snapshot, meta] = await Promise.all([
  //   snapshotReader(url),
  //   metaReader(url),
  // ]);
  const meta = await metaReader(url);
  return meta;
}
