import { renameSync } from 'node:fs';
import { processWrites } from 'oro-functions';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/ogh.ts'],
  outDir: './bin',
  format: ['esm'],
  dts: false,
  minify: true,
  clean: true,
  external: ['keytar'],
  onSuccess: async () => {
    renameSync('./bin/ogh.js', './bin/ogh');
    processWrites([
      { c: 'yellow', s: 'ORO' },
      { s: ` ✏️ Renamed ` },
      { s: `\u001B[1mbin\\ogh.js\u001B[0m` },
      { s: ` to ` },
      { s: `\u001B[1mbin\\ogh\u001B[0m` },
      { s: `\n` },
    ]);
  },
});
