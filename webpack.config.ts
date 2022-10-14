import * as path from "path";
import * as copyWebpackPlugin from "copy-webpack-plugin";
import { Configuration } from "webpack";

export const rootDirectory = path.resolve(__dirname);
export const buildDirectory = path.resolve(rootDirectory, "dist");

const config: Configuration = {
  entry: "./src/init.ts",
  mode: "production",
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(rootDirectory, "src", "config"),
          to: path.resolve(buildDirectory, "config"),
        },
        {
          from: path.resolve(rootDirectory, "src", "multimedia"),
          to: path.resolve(buildDirectory, "multimedia"),
        },
        {
          from: path.resolve(rootDirectory, "src", "index.html"),
          to: path.resolve(buildDirectory),
        },
      ],
    }),
  ],
};

export default config;
