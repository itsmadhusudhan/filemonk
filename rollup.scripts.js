import babel from "rollup-plugin-babel";
// import license from "rollup-plugin-license";
import { terser } from "rollup-plugin-terser";
// import prettier from "rollup-plugin-prettier";
// const banner = require('./banner');
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";
import resolve from "rollup-plugin-node-resolve";

const createBuild = (options) => {
  const { format, id, name, minify = false, transpile = false } = options;

  // get filename
  const filename = ["lib/", name];
  if (format === "es") {
    filename.push(".esm");
  }
  if (format === "umd") {
    // filename.push(".umd");
  }
  if (minify) {
    filename.push(".min");
  }
  filename.push(".js");

  // collect plugins
  const plugins = [
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
  ];
  if (transpile) {
    plugins.push(
      babel({
        exclude: ["node_modules/**"],
      })
    );
  }
  if (minify) {
    plugins.push(terser());
  } else {
    // plugins.push(
    //   prettier({
    //     singleQuote: true,
    //     parser: "babel",
    //   })
    // );
  }
  //   plugins.push(license({ banner: banner(options) }));

  plugins.push(esbuild());

  // return Rollup config
  return {
    input: "src/index.ts",
    treeshake: false,
    output: [
      {
        format,
        name: id,
        file: filename.join(""),
      },
    ],
    plugins,
  };
};

export default (metadata, configs) => [
  ...configs.map((config) => createBuild({ ...metadata, ...config })),
  {
    plugins: [dts()],
    input: "src/index.ts",
    output: {
      file: `./index.d.ts`,
      format: "es",
    },
    external: (id) => {
      return !/^[./]/.test(id);
    },
  },
  {
    plugins: [dts()],
    input: "src/types.ts",
    output: {
      file: `./index.d.ts`,
      format: "es",
    },
    external: (id) => {
      return !/^[./]/.test(id);
    },
  },
];
