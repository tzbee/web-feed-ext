import log from '../../background/log';

/*
	Network fetcher using XHR with JQuery
*/

const $ = require('jquery');

const DEFAULT_LOG = message => log(message);

module.exports = class Fetcher {
	constructor(options = {}) {
		this.log = options.log || DEFAULT_LOG;
	}

	fetch(url) {
		this.log(`Fetching ${url} using XHR`);

		return new Promise((resolve, reject) => {
			const xhrOptions = {
				success: (data, status, xhr) => {
					resolve(data);
				}
			};

			$.ajax(url, xhrOptions);
		});
	}
};
