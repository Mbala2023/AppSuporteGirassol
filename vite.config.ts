import path from "node:path";
import type { UserConfigFn } from "vite";
import { overrideVaadinConfig } from "./vite.generated";
import tailwindcss from "@tailwindcss/vite";

const customConfig: UserConfigFn = (env) => ({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/main/frontend"),
    },
  },
});
export default overrideVaadinConfig(customConfig);