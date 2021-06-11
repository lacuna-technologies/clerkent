const path = require(`path`)

module.exports = {
    process(source, filename, config, options) {
        return `module.exports = '${JSON.stringify({
            path: path.basename(filename),
            source,
        })}';`
    },
}
