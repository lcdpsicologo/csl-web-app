import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Reglas experimentales del React Compiler (eslint-plugin-react-hooks v6 RC)
      // que eslint-config-next activa como error. Este proyecto todavía no adopta
      // el React Compiler y usa patrones válidos que estas reglas marcan igual
      // (mutación de ref.current, `new Date()` en render, efectos de "seed" de una
      // sola vez, subcomponentes inline). Se dejan como advertencia: siguen visibles
      // como guía para una futura migración, sin bloquear como errores.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      // Permite variables/argumentos intencionalmente sin usar con prefijo "_".
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
