import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";
import * as path from 'path';

// https://vitejs.dev/config/
// https://dev.to/whchi/how-to-use-processenv-in-vite-ho9
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      visualizer({
        template: "treemap", // or sunburst
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: "analyse.html", // will be saved in project's root
      })
    ],
    base: "./",
    resolve: {
      alias: [
        { 
          find: /^(addons|classes|components|pages)\/([^\/]*)$/, 
          replacement: "./src/@$1/$2.tsx"
        },
        { 
          find: /(data|images)\/([^\/]*)$/,
          replacement: "./src/@$1/$2"
        },
        { 
          find: /react:/, 
          replacement: path.resolve(__dirname, 'node_modules/react')
        }
      ]
    },
    define: {
      'process.env': env
    }
  }
});