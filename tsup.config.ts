import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'dayjs', 'dayjs/plugin/relativeTime', 'dayjs/plugin/utc', 'dayjs/plugin/timezone', 'dayjs/plugin/isSameOrBefore', 'dayjs/plugin/isoWeek', 'dayjs/plugin/quarterOfYear', 'lucide-react', 'react-hook-form'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
