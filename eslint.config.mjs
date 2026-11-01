import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Same rule sets as the old .eslintrc.json ("next/core-web-vitals" + "next/typescript"),
// in the flat-config format Next.js 16 / ESLint 9 use. `next lint` was removed in Next 16.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // New rule in eslint-plugin-react-hooks 7 (comes with eslint-config-next 16).
    // count-up sets its final value once when the user prefers reduced motion,
    // which is intended; kept as-is rather than rewriting the component.
    files: ["components/ui/count-up.tsx"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
