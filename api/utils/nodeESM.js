import url from 'url';
import path from 'path';

export const filename = (meta) => url.fileURLToPath(meta.url);

export const dirname = (meta) => path.dirname(filename(meta));

export default {
  filename,
  dirname,
};
