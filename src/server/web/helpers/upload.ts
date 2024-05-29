import fs from 'fs-extra';
import { nanoid } from 'nanoid';
import path from 'path';
import { UPLOADS_URL_PREFIX } from 'src/common/config';
import { runtimeUploadsPath } from 'src/common/paths.app';
import { z } from 'zod';

export async function saveUploads(fileField: unknown) {
  const PersistentFileSchema = z.object({
    filepath: z.string(),
    newFilename: z.string(),
    originalFilename: z.string(),
    mimetype: z.string(),
    size: z.number(),
  });
  type PersistentFile = z.infer<typeof PersistentFileSchema>;
  const saveFile = async (f: PersistentFile) => {
    const ext = path.extname(f.originalFilename);
    const newFilename =
      path.basename(f.originalFilename, ext) + '.' + nanoid() + ext;
    const newFilepath = path.resolve(runtimeUploadsPath, newFilename);
    await fs.move(f.filepath, newFilepath);
    return {
      newFilename,
      originalFilename: f.originalFilename,
      mimetype: f.mimetype,
      size: f.size,
      url: UPLOADS_URL_PREFIX + '/' + newFilename,
    };
  };
  const r1 = PersistentFileSchema.safeParse(fileField);
  if (r1.success) {
    return await saveFile(r1.data);
  }
  const r2 = z.array(PersistentFileSchema).safeParse(fileField);
  if (r2.success) {
    return await Promise.all(r2.data.map(saveFile));
  }
  return null;
}
