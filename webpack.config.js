const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const PostCSSPresetEnv = require("postcss-preset-env");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",
  stats: {
    colors: true,
    preset: "minimal",
  },
  performance: { hints: isDev ? false : "warning" },
  // Eval does not work for css source maps
  // `All values enable source map generation except eval and false value.`
  // https://github.com/webpack-contrib/css-loader
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  entry: [
    path.resolve(__dirname, "src/js/main.js"),
    path.resolve(__dirname, "src/styles/main.scss"),
  ],
  output: {
    filename: isDev ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "_site/assets"),
    publicPath: "/assets/",
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
    }),
  ],
  ...(!isDev && {
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
  }),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // translates CSS into CommonJS modules
            loader: "css-loader",
          },
          {
            // Run postcss actions
            loader: "postcss-loader",
          },
          {
            // compiles Sass to CSS
            loader: "sass-loader",
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        generator: {
          filename: `images/${isDev ? "[name][ext]" : "[contenthash][ext]"}`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: `fonts/${isDev ? "[name][ext]" : "[contenthash][ext]"}`,
        },
      },
    ],
  },
};

