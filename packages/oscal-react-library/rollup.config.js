import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

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
    postcss(),
    typescript({
      tsconfigOverride: {
        exclude: ["**/stories.*"],
      },
    }),
    resolve({ preferBuiltins: false, extensions: EXTENSIONS }),
    peerDepsExternal(),
    json(),
    commonjs({ include: /node_modules/ }),
    babel({
      babelHelpers: "bundled",
      extensions: EXTENSIONS,
      exclude: "**/node_modules/**",
    }),
  ],
};
