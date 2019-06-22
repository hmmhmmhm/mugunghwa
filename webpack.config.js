const path = require('path')
const clone = require('clone')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var mugunghwaConfig = {
	entry: './mugunghwa.js',
	mode: 'production',
	devtool: 'none',
	target: 'web',
	output: {
		filename: 'mugunghwa.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: './',

		library: 'mugunghwa',
		libraryTarget: 'this',
		libraryExport: 'default'
	},

	plugins: [],

	module: {
		unsafeCache: true,
		rules: [{
			test: /\.js$/,
			include: path.join(__dirname),
			exclude: /(node_modules)|(dist)/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['env'],
					plugins: []
				}
			}
		}]
	},

	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin({
			uglifyOptions: {}
		})]
	},

	node: {
		console: false,

		global: false,
		process: false,
		setImmediate: false,
	
		path: false,
		url: false,

		Buffer: false,
		__filename: false,
    	__dirname: false,

		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
}

var mugungConfig = clone(mugunghwaConfig)
mugungConfig['entry'] = './mugung.js'
mugungConfig['output']['filename'] = 'mugung.js'
mugungConfig['output']['library'] = 'mugung'
mugungConfig['module']['rules'][0]['use']['query']['babelrc'] = false
mugungConfig['module']['rules'][0]['use']['query']['plugins'] = ['overload']
delete(mugungConfig['optimization']['minimizer'])

module.exports = [mugunghwaConfig, mugungConfig]