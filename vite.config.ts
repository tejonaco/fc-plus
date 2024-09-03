import preact from '@preact/preset-vite'
import { ConfigEnv, UserConfig, defineConfig } from "vite";
import fs from 'fs';
import {version} from "./package.json"

function prepareHeader() {
  const fileContents = fs.readFileSync('src/userscript-header.js', 'utf-8')

  const css = process.env.WATCH? 'style.css': `https://github.com/tejonaco/fc-plus/releases/download/${version}/style.css`

  return fileContents.replace('{{version}}', version).replace('{{css}}', css)
}

export default defineConfig((mode: ConfigEnv): UserConfig => {
  return {
    plugins: [preact()],
    build: {
      target: "esnext",
      minify: false,
      outDir: "dist",
      watch: {
        include: 'src'
      },
      lib: {
        entry: 'src/index.tsx',
        name: 'index',
        fileName: () => 'index.user.js',
        formats: ["iife"]
      },
      rollupOptions: {
        output: {
          banner: prepareHeader
        },
      }
    },
    define: {
      // https://github.com/vitejs/vite/discussions/13587
      "process.env.NODE_ENV": JSON.stringify(mode),
  },
  }
});