import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";

const perfectionistRecommended = perfectionist.configs["recommended-natural"];

const modifiedPerfectionist = {
  ...perfectionistRecommended,
  rules: Object.fromEntries(
    Object.entries(perfectionistRecommended.rules).map(([rule, config]) => [
      rule,
      config === "error" ? "warn" : config,
    ]),
  ),
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  modifiedPerfectionist,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
