import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import json from "@rollup/plugin-json";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.cjs,
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
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
      terser(),
      postcss(),
      svgr(),
    ],
    // external: {
    //   react: "https://unpkg.com/react@18/umd/react.production.min.js",
    //   "react-dom":
    //     "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
    //   "react/jsx-runtime":
    //     "https://unpkg.com/browse/react@18.2.0/cjs/react-jsx-runtime.production.min.js",
    // },
    external: ["react", "react-dom"],
    // external: [Object.keys(packageJson.peerDependencies)],
    // external: [/node_modules/],
  },
  {
    input: "src/index.tsx",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
