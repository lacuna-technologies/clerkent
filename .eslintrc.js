module.exports = {
  "env": {
    "webextensions": true,
  },
  extends: [
    `react-app`,
    `plugin:sonarjs/recommended`,
    `plugin:unicorn/recommended`,
    `plugin:import/errors`,
    `plugin:import/warnings`,
    `plugin:import/typescript`,
    `plugin:react-hooks/recommended`,
  ],
  globals: {
    __PATH_PREFIX__: true,
  },
  overrides: [
    {
      files: [`*.json`],
      settings: {
        "disable/plugins": [`no-secrets`],
      },
    },
  ],
  parser: `@typescript-eslint/parser`,
  plugins: [
    `json-format`,
    `disable`,
    `no-secrets`,
    `sonarjs`,
    `sort-keys-fix`,
    `import`,
    `react-hooks`,
  ],
  processor: `disable/disable`,
  rules: {
    "comma-dangle": [
      `warn`,
      `always-multiline`,
    ],
    "import/no-named-as-default": `off`,
    "jsx-a11y/accessible-emoji": `off`,
    "no-secrets/no-secrets": [
      `error`,
      {
        ignoreContent: [
          `^https?://`,
        ],
      },
    ],
    "prefer-const": `warn`,
    quotes: [
      `error`,
      `backtick`,
    ],
    "security/detect-non-literal-fs-filename": `off`,
    "security/detect-non-literal-require": `off`,
    "security/detect-object-injection": `off`,
    semi: [
      `warn`,
      `never`,
    ],
    "sort-keys-fix/sort-keys-fix": `warn`,
    "unicorn/filename-case": [
      `error`,
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        ignore: [
          `[A-Z]{2,4}`,
        ],
      },
    ],
    "unicorn/no-array-reduce": `off`,
    "unicorn/no-null": 0,
    "unicorn/prevent-abbreviations": [
      `warn`,
      {
        allowList: {
          Props: true,
          props: true,
        },
      },
    ],
  },
  "settings": {
    "node": {
      "tryExtensions": [`.tsx`], // append tsx to the list as well
    },
  },
}