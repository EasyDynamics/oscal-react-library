import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
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
    resolve({ preferBuiltins: false, extensions: EXTENSIONS }),
    peerDepsExternal(),
    postcss(),
    typescript({
      tsconfigOverride: {
        exclude: ["**/stories.*"],
      },
    }),
    commonjs({ include: /node_modules/ }),
    babel({
      babelHelpers: "bundled",
      extensions: EXTENSIONS,
      exclude: "**/node_modules/**",
    }),
  ],
  external: ["react", "react-dom", "react-markdown", /@mui\//],
};
