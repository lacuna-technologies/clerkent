import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import FilemanagerPlugin from 'filemanager-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ExtensionReloader from 'webpack-extension-reloader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import WextManifestWebpackPlugin from 'wext-manifest-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

const viewsPath = path.join(__dirname, `views`)
const sourcePath = path.join(__dirname, `src`)
const destinationPath = path.join(__dirname, `extension`)
const generatedAssetsPath = path.join(__dirname, `generated`)
const nodeEnvironment = process.env.NODE_ENV || `development`
const targetBrowser = process.env.TARGET_BROWSER

const extensionReloaderPlugin =
  nodeEnvironment === `development`
    ? new (ExtensionReloader as any)({
      entries: {
        
        background: `background`,
        // TODO: reload manifest on update
        contentScript: `contentScript`,
        extensionPage: [`popup`, `options`, `massCitations`],
      },
      port: 9090,
      reloadPage: true,
    })
    : () => {}

const getExtensionFileType = (browser: string) => {
  if (browser === `opera`) {
    return `crx`
  }

  if (browser === `firefox`) {
    return `xpi`
  }

  return `zip`
}

if(!fs.existsSync(destinationPath)){
  fs.mkdirSync(destinationPath)
}

if(!fs.existsSync(generatedAssetsPath)){
  fs.mkdirSync(generatedAssetsPath)
}

const WebpackConfig = {
  devtool: false, 

  entry: {
    background: path.join(sourcePath, `Background`, `index.tsx`),
    contentScript: path.join(sourcePath, `ContentScript`, `index.tsx`),
    manifest: path.join(sourcePath, `manifest.json`),
    massCitations: path.join(sourcePath, `pages`, `MassCitations`, `index.tsx`),
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
      {
        test: /\.ttf$/,
        use: [
          {
            loader: `file-loader`,
            options: {
              esModule: false,
              name: `[name].[ext]`,
              outputPath: `fonts/`,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: `file-loader`,
            options: {
              esModule: false,
              name: `[name].[ext]`,
              outputPath: `assets/icons/`,
              publicPath: `/assets/icons/`,
            },
          },
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
      chunks: [`background`],
      filename: `background.html`,
      hash: true,
      inject: `body`,
      template: path.join(viewsPath, `background.html`),
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
    new HtmlWebpackPlugin({
      chunks: [`massCitations`],
      filename: `mass-citations.html`,
      hash: true,
      inject: `body`,
      template: path.join(viewsPath, `mass-citations.html`),
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: `css/[name].css` }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [{ from: `${generatedAssetsPath}`, to: `assets` }],
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

export default WebpackConfig