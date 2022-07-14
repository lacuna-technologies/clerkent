const path = require(`path`)

module.exports = {
  process(source, filename, config, options) {
    return {
      code: `module.exports = '${JSON.stringify({
        path: path.basename(filename),
        source,
      })}';`,
    }
  },
}
