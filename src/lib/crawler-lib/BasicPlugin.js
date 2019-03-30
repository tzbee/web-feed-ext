const Fetcher = require('./Fetcher');
const { runSequence } = require('./async-utils');

const isRelativeURL = url => /^\/{1}[^\/]{1}[^?#]*/.test(url);

const isHash = url => /[#]{1}[^?#]*/.test(url);

const isProtocolRelativeURL = url => /^\/{2}[^?#]*/.test(url);

const toAbsoluteURL = (parsedSourceURL, href) => {
	if (!href) return '';
	return isRelativeURL(href)
		? parsedSourceURL.origin + href
		: isProtocolRelativeURL(href)
		? parsedSourceURL.protocol + href
		: isHash(href)
		? parsedSourceURL.href + href
		: href;
};

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
		const fetchResPromise = fetchPromise.then(html => {
			const parsedSourceURL = new URL(url);
			const parserResults = parser.parse(html).map(result => {
				// Convert found urls into absolute url if needed
				result.url = toAbsoluteURL(parsedSourceURL, result.url);
				result.img = toAbsoluteURL(parsedSourceURL, result.img);

				return result;
			});
			return parserResults;
		});
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
