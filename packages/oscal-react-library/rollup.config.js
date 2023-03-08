import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default {
  input: ["src/index.ts"],
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({
      babelHelpers: "runtime",
      presets: ["@babel/preset-react"],
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    commonjs(),
    typescript(),
    postcss(),
  ],
  external: ["react", "react-dom", /@babel\/runtime/],
};
