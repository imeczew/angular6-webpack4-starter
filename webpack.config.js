const webpack = require("webpack");
const ngcWebpack = require("ngc-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var path = require("path");

var _root = path.resolve(__dirname, ".");

function getRoot(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

module.exports = function(env, argv) {
  return {
    mode: env.production ? 'production' : 'development',

    entry: {
      app: getRoot("src", "main.ts"),
      polyfills: getRoot("src", "polyfills.ts"),
    },

    target: "web",

    devtool: env.production ? false : "inline-source-map",

    output: {
      path: getRoot("js"),
      filename: "[name].js"
    },

    resolve: {
      extensions: [".ts", ".js", ".html"]
    },

    externals: {
      jquery: 'jQuery'
    },

    module: {
      rules: [
        // Typescript
        // (MUST come before .js test, otherwise --watch mode wont work!!!)
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "@ngtools/webpack"
        },
        {
          test: /.js$/,
          parser: {
            system: true
          }
        },
        // Templates
        {
          test: /\.html$/,
          exclude: getRoot("src", "index.html"),
          use: [
            {
              loader: "raw-loader"
            }
          ]
        },
        {
         test: /\.scss$/,
         include: getRoot("src"),
         use: ["raw-loader", "sass-loader"]
        },
        {
          test: /\.scss$/,
          include: getRoot("scss"),
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: {
                //disable url() resolving
                url: false
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          include: getRoot("img"),
          use: [
            {
              loader: "file-loader",
              options: {
                emitFile: false,
                name: '[name].[ext]',
                useRelativePath: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ngcWebpack.NgcWebpackPlugin({
        tsConfigPath: getRoot("tsconfig.json"),
        mainPath: getRoot("src", "main.ts")
      }),

      new MiniCssExtractPlugin({
        filename: "../css/[name].css"
      })

    ]
  };
};
