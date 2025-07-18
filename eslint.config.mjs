import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable alt-text rule for lucide icon components  
      "jsx-a11y/alt-text": ["error", {
        "elements": ["img", "object", "area", "input[type='image']"],
        "img": ["Image"],
        "object": ["Object"],
        "area": ["Area"],
        "input[type='image']": ["InputImage"]
      }]
    }
  }
];

export default eslintConfig;
