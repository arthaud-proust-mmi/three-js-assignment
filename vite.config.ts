import viteTsconfigPaths from "vite-tsconfig-paths";

export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  plugins: [viteTsconfigPaths()],
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
};
