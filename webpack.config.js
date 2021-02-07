const path = require(`path`)
const webpack = require(`webpack`)
const FilemanagerPlugin = require(`filemanager-webpack-plugin`)
const TerserPlugin = require(`terser-webpack-plugin`)
const CopyWebpackPlugin = require(`copy-webpack-plugin`)
const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const ExtensionReloader = require(`webpack-extension-reloader`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const WextManifestWebpackPlugin = require(`wext-manifest-webpack-plugin`)
const ForkTsCheckerWebpackPlugin = require(`fork-ts-checker-webpack-plugin`)
const OptimizeCSSAssetsPlugin = require(`optimize-css-assets-webpack-plugin`)

const viewsPath = path.join(__dirname, `views`)
const sourcePath = path.join(__dirname, `src`)
const destinationPath = path.join(__dirname, `extension`)
const nodeEnvironment = process.env.NODE_ENV || `development`
const targetBrowser = process.env.TARGET_BROWSER

const extensionReloaderPlugin =
  nodeEnvironment === `development`
    ? new ExtensionReloader({
      entries: {
        
        background: `background`,
        // TODO: reload manifest on update
contentScript: `contentScript`,
        extensionPage: [`popup`, `options`],
      },
      port: 9090,
      reloadPage: true,
    })
    : () => {
      this.apply = () => {}
    }

const getExtensionFileType = (browser) => {
  if (browser === `opera`) {
    return `crx`
  }

  if (browser === `firefox`) {
    return `xpi`
  }

  return `zip`
}

module.exports = {
  devtool: false, 

  entry: {
    background: path.join(sourcePath, `Background`, `index.ts`),
    contentScript: path.join(sourcePath, `ContentScript`, `index.ts`),
    manifest: path.join(sourcePath, `manifest.json`),
    options: path.join(sourcePath, `Options`, `index.tsx`),
    popup: path.join(sourcePath, `Popup`, `index.tsx`),
  },

  
mode: nodeEnvironment,

  
module: {
    rules: [
      {
        
exclude: /node_modules/, 
        // prevent webpack handling json with its own loaders,
test: /manifest\.json$/,
        type: `javascript/auto`,
        use: {
          loader: `wext-manifest-loader`,
          options: {
            usePackageJSONVersion: true, // set to false to not use package.json version for manifest
          },
        },
      },
      {
        exclude: /node_modules/,
        loader: `babel-loader`,
        test: /\.(js|ts)x?$/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: `css-loader`, // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true,
            },
          },
          {
            loader: `postcss-loader`,
            options: {
              postcssOptions: {
                plugins: [
                  [
                    `autoprefixer`,
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          `resolve-url-loader`, // Rewrites relative paths in url() statements
          `sass-loader`, // Takes the Sass/SCSS file and compiles to the CSS
        ],
      },
    ],
  },

  
output: {
    filename: `js/[name].bundle.js`,
    path: path.join(destinationPath, targetBrowser),
  },

  
plugins: [
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    new webpack.SourceMapDevToolPlugin({ filename: false }),
    new ForkTsCheckerWebpackPlugin(),
    // environmental variables
    new webpack.EnvironmentPlugin([`NODE_ENV`, `TARGET_BROWSER`]),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`,
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      chunks: [`popup`],
      filename: `popup.html`,
      hash: true,
      inject: `body`,
      template: path.join(viewsPath, `popup.html`),
    }),
    new HtmlWebpackPlugin({
      chunks: [`options`],
      filename: `options.html`,
      hash: true,
      inject: `body`,
      template: path.join(viewsPath, `options.html`),
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: `css/[name].css` }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [{ from: `generated/`, to: `assets` }],
    }),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin,
  ],

  
resolve: {
    alias: {
      'webextension-polyfill-ts': path.resolve(
        path.join(__dirname, `node_modules`, `webextension-polyfill-ts`),
      ),
    },
    extensions: [`.ts`, `.tsx`, `.js`, `.json`],
  },

  // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342
stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  ...(nodeEnvironment === `production` ? ({
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          parallel: true,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: [`default`, { discardComments: { removeAll: true } }],
          },
        }),
        new FilemanagerPlugin({
          events: {
            onEnd: {
              archive: [
                {
                  destination: `${path.join(destinationPath, targetBrowser)}.${getExtensionFileType(targetBrowser)}`,
                  format: `zip`,
                  options: { zlib: { level: 6 } },
                  source: path.join(destinationPath, targetBrowser),
                },
              ],
            },
          },
        }),
      ],
    },
  }) : {}),

  watchOptions: {
    ignored: [
      `node_modules/**`,
      `extension/**`,
    ],
    poll: 1000,
  },
}
