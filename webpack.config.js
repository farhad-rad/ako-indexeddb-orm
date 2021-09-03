// https://webpack.js.org/configuration/
const minimize = process.env.MIN ? true : false;
//const minimize = false;
let webpack = require('webpack'),
    path = require('path'),
    pkg = require("./package.json"),
    banner =
        '\n' +
        pkg.name + ' -  ' + pkg.version + '\n' +
        pkg.author + ` ${["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].find((x, i) => i == new Date().getMonth())} ${new Date().getFullYear()}`+ '\n' +
        pkg.contributors.map(x => `${x.name} <${x.email}>`).join('\n') + '\n' +
        pkg.homepage + '\n' +
        'Under ' + pkg.license + ' license ' + '\n' +
        '\n',
    fileName = pkg.name.replace(/@/g,'').replace(/\//g,'-') + ".js",
    plugins = [
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version)
        })
    ];

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    fileName = pkg.name.replace(/@/g,'').replace(/\//g,'-') + ".min.js";
}
module.exports = {
    entry: ["./src/initializer.js"], // string | object | array
    output: {
        library: "AkoPrototypes",
        libraryTarget: "umd2",
        path: path.resolve(__dirname, "dist"), // string
        filename: fileName // string
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "./src")
                ],
                exclude: [
                    path.resolve(__dirname, "./node_module")
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    plugins: plugins
}