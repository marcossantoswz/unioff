import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "components/CadastroEstudante.tsx",
        "components/CadastroEmpresa.tsx",
        "components/Resgatar.tsx",
        "components/ValidarCupom.tsx",
        "components/BeneficioForm.tsx",
        "components/ExigePerfil.tsx",
        "components/ListaCupons.tsx",
        "components/Metricas.tsx",
        "components/StatusCupom.tsx",
        "app/estudante/me/resgates/page.tsx",
        "lib/format.ts",
      ],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
