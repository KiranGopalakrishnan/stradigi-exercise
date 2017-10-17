const ExtractTextPlugin = require("extract-text-webpack-plugin");
config = {
  entry: {
    main:"./js/main.js",
    panel:"./js/panel.js"},
    output: {
      filename: "[name].bundle.js",
      path: __dirname+"/build",
      publicPath: "./build/"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },{
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
            },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    }, plugins: [
        new ExtractTextPlugin("[name].css")
    ]
  }

  module.exports = config;
