import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        const copyDir = (src, dest) => {
          if (fs.existsSync(src)) {
            fs.mkdirSync(dest, { recursive: true });
            fs.cpSync(src, dest, { recursive: true });
          }
        };

        // Copy certificates and resume PDFs so links in index.html don't 404
        copyDir(path.resolve(__dirname, 'assets/certificates'), path.resolve(__dirname, 'dist/assets/certificates'));
        copyDir(path.resolve(__dirname, 'assets/resume'), path.resolve(__dirname, 'dist/assets/resume'));
      }
    }
  ]
});
