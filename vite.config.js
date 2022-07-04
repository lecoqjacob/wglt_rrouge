import hq from 'alias-hq';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: hq.get('rollup'),
  },
});
