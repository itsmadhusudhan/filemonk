import * as pkg from "./package.json";
import build from "./rollup.scripts";

export default build(
  {
    id: "FileMonk",
    ...pkg,
  },
  [
    {
      format: "umd",
      transpile: true,
      globals: {
        uuid: "uuid",
        axios: "axios",
      },
    },
    {
      format: "umd",
      transpile: true,
      minify: true,
      globals: {
        uuid: "uuid",
        axios: "axios",
      },
    },
    {
      format: "es",
    },
    {
      format: "es",
      minify: true,
    },
  ]
);

// import dts from "rollup-plugin-dts";
// import esbuild from "rollup-plugin-esbuild";
// import externals from "rollup-plugin-node-externals";
// import NodeResolve from "@esbuild-plugins/node-resolve";

// const name = require("./package.json").main.replace(/\.js$/, "");

// const bundle = (config) => {
//   return {
//     ...config,
//     input: "src/index.ts",
//     // external: (id) => {
//     //   return !/^[./]/.test(id);
//     // },
//   };
// };

// const globals = {
//   uuid: "uuid",
//   "date-fns": "date-fns",
// };

// export default [
//   bundle({
//     plugins: [esbuild()],
//     external: ["uuid", "date-fns"],
//     output: [
//       {
//         file: `${name}.js`,
//         format: "cjs",
//         sourcemap: true,
//         name: "filemonk",
//         globals,
//       },
//       {
//         file: `${name}.mjs`,
//         format: "es",
//         sourcemap: true,
//         name: "filemonk",
//         globals,
//       },
//       {
//         file: `${name}.umd.js`,
//         format: "umd",
//         sourcemap: true,
//         name: "filemonk",
//         globals,
//       },
//     ],
//   }),
//   bundle({
//     plugins: [dts()],
//     output: {
//       file: `./index.d.ts`,
//       format: "es",
//       globals,
//     },
//   }),
// ];
