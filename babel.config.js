module.exports = {
  exclude: [
    `/node_modules/`,
  ],
  plugins: [
    [
      `@babel/plugin-transform-react-jsx`,
      {
        importSource: `preact`,
        runtime: `automatic`,
      },
    ],
    [
      // Polyfills the runtime needed for async/await and generators
      `@babel/plugin-transform-runtime`,
      {
        helpers: false,
        regenerator: true,
      },
    ],
  ],
  presets: [
    [
      `@babel/preset-env`,
      {
        targets: `> 0.25%, not dead`,
      },
    ],
    [`@babel/typescript`, { jsxPragma: `h` }],
  ],
}