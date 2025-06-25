import typescript from "@rollup/plugin-typescript";
export default {
  input: "src/index.ts",
  output: [
    { file: "dist/ddg.cjs.js", format: "cjs" },
    { file: "dist/ddg.esm.js", format: "esm" },
    { file: "dist/ddg.umd.js", format: "umd", name: "DDG" },
  ],
  plugins: [typescript()],
};
