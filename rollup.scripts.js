import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
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
      preferBuiltins: true,
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
    treeshake: true,
    output: {
      format,
      name: id,
      file: filename.join(""),
      globals: {
        axios: "axios",
      },
    },
    plugins,
    external: [
      "axios",
      "http", // imported by axios
      "https", // imported by axios
      "url", // imported by follow-redirects
      "assert", // imported by follow-redirects
      "stream", // imported by follow-redirects
      "tty", // imported by follow-redirects
      "util", // imported by follow-redirects
      "zlib", // imported by axios
    ],
  };
};

export default (metadata, configs) => [
  // ...configs.map((config) => createBuild({ ...metadata, ...config })),
  {
    plugins: [dts()],
    input: "src/index.ts",
    output: {
      file: `./lib/index.d.ts`,
      format: "es",
    },
    external: (id) => {
      return !/^[./]/.test(id);
    },
  },
];
