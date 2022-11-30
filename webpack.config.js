const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  context: __dirname,
  entry: {
    filemonk: path.resolve(__dirname, "src/index.ts"),
    "filemonk.min": path.resolve(__dirname, "src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "FileMonk",
    umdNamedDefine: true,
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            // options: {
            //   transpileOnly: true,
            //   projectReferences: true,
            // },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  mode: "production",
};

module.exports = () => {
  if (!isProduction) {
    config.mode = "development";
  }
  return config;
};
