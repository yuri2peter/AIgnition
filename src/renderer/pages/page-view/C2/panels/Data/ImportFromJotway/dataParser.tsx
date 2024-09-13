import { cloneDeep } from 'lodash';
import { z } from 'zod';

export function dataParser(data: unknown) {
  const originalData = cloneDeep(data);
  const {
    data: { linkers },
  } = dbSchema.parse(originalData);
  const dirs: {
    tag: string;
    count: number;
    linkers: Linker[];
  }[] = [];
  linkers.sort((a, b) => b.accessCount - a.accessCount);
  linkers.forEach((linker) => {
    if (linker.tags.length === 0) {
      linker.tags = ['No Tag'];
    }
    linker.tags.forEach((tag) => {
      const tagInfo = dirs.find((info) => info.tag === tag);
      if (tagInfo) {
        tagInfo.count += 1;
      } else {
        dirs.push({
          tag,
          count: 1,
          linkers: [],
        });
      }
    });
  });
  dirs.sort((a, b) => b.count - a.count);
  linkers.forEach((linker) => {
    const dir = dirs.find((info) => linker.tags.includes(info.tag))!;
    dir.linkers.push(linker);
  });
  const dirs2 = dirs.filter((info) => info.linkers.length > 0);
  return dirs2;
}

export type DataParsed = ReturnType<typeof dataParser>;

const linkerSchema = z.object({
  id: z.string(),

  name: z.string(), // 名字
  desc: z.string(), // 描述
  url: z.string(), // 链接
  icon: z.string(), // 图标
  tags: z.array(z.string()), // 标签

  article: z.boolean(), // 是否是文章
  content: z.string(), // 内容（文章专用）

  accessAt: z.number(), // 访问时间
  createdAt: z.number(), // 创建时间
  updatedAt: z.number(), // 修改时间
  accessCount: z.number(), // 访问次数
  pin: z.boolean(), // 设置为置顶
});

type Linker = z.infer<typeof linkerSchema>;

const dbSchema = z.object({
  data: z.object({ linkers: z.array(linkerSchema) }),
});
