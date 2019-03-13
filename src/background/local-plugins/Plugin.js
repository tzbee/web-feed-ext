const BasicPlugin = require('../../lib/crawler-lib').BasicPlugin;
const Parser = require('./Parser'); // sync

module.exports = class DefaultLinkCrawlerPlugin extends BasicPlugin {
    constructor(options = {}) {
        super(
            Object.assign({
                parser: new Parser({ log: options.log }),
                log: options.log
            })
        );
        Object.assign(this, require('./meta.json'), {
            fn: this.run.bind(this)
        });
    }
};
