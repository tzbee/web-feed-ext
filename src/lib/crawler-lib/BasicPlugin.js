const Fetcher = require('./Fetcher');
const { runSequence } = require('./async-utils');

const DEFAULT_LOG = message => console.log(message);

module.exports = class BasicPlugin {
	constructor(options = {}) {
		const { parser, fetcher, log = DEFAULT_LOG } = options;
		this.parser = parser;
		this.log = log;
		this.fetcher = fetcher || new Fetcher({ log });
	}

	_fetchAndParseSingleURL(url) {
		const { fetcher, parser } = this;
		const fetchPromise = fetcher.fetch(url);
		const fetchResPromise = fetchPromise.then(html => parser.parse(html));
		return fetchResPromise;
	}

	run({ urls }) {
		const { fetcher, parser } = this;

		const fetchAndParseQueue = urls.map(url =>
			this._fetchAndParseSingleURL.bind(this, url)
		);

		// Concatenate all results
		const concatResPromise = runSequence(fetchAndParseQueue).then(resList =>
			resList.reduce((r, fetchRes) => {
				return r.concat(fetchRes);
			}, [])
		);

		return concatResPromise;
	}
};
