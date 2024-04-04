import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import json from "@rollup/plugin-json";
import progress from "rollup-plugin-progress";
import filesize from "rollup-plugin-filesize";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      progress(),
      peerDepsExternal(),
      resolve(),
      json(),
      filesize(),
      terser(),
      postcss(),
      svgr(),
      typescript({ tsconfig: "./tsconfig.json" }),
      commonjs(),
    ],
  },
  {
    input: "src/index.tsx",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
