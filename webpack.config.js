const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.hooks.done.tap("DtsBundlePlugin", (stats) => {
    const dts = require("dts-bundle");

    dts.bundle({
      name: "FileMonk",
      main: path.resolve(__dirname, "src/index.ts"),
      out: path.resolve(__dirname, "lib/index.d.ts"),
      removeSource: true,
      outputAsModuleFolder: true,
    });
  });
};

module.exports = {
  context: __dirname,
  entry: {
    filemonk: path.resolve(__dirname, "src/index.ts"),
    "filemonk.min": path.resolve(__dirname, "src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    // library: "FileMonk",
    // libraryTarget: "umd",
    // umdNamedDefine: true,
    clean: true,
    library: {
      name: "FileMonk",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "source-map",
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    // new DtsBundlePlugin(),
    // new NpmDtsPlugin({
    //   entry: "./src/index.ts",
    // }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              projectReferences: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  mode: "production",
};
