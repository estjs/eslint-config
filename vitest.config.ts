import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    "include": ["test/**/*.test.js"],
    "exclude": ["**/node_modules/**", "**/dist/**"],
    "coverage": {
      "reporter": ["text", "json", "html"],
      "exclude": [
        "node_modules/",
        "test/fixtures/",
        "dist/"
      ]
    },
    "environment": "node",
    "testTimeout": 10000
  },
})
