const BasicPlugin = require('../../../lib/crawler-lib/BasicPlugin');
const Parser = require('./Parser'); // sync

module.exports = class IMDBOpeningThisWeekPlugin extends BasicPlugin {
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

	run() {
		return super.run({ urls: ['https://www.imdb.com/'] });
	}
};
