import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'xn4qh6',
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    retries: 2,
  },
});
