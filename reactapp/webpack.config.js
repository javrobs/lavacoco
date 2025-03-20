const path = require("path");
module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "../frontend/static/frontend/"),
        filename: "main.js",
    },
    module: { rules: [
        { test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"}},
        { test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        }
    ]},
    optimization: {minimize: true},
    stats:{errorDetails: true}
};