/*
	Network fetcher using XHR with JQuery
*/

const $ = require('jquery');

const DEFAULT_LOG = message => console.log(message);

module.exports = class Fetcher {
	constructor(options = {}) {
		this.log = options.log || DEFAULT_LOG;
	}

	fetch(url) {
		const options = {
			url
		};

		this.log(`Fetching ${url} using XHR`);

		return new Promise((resolve, reject) => {
			const xhrOptions = {
				success: (data, status, xhr) => {
					resolve(data);
				}
			};

			$.ajax(url, xhrOptions);
			// request(
			// 	{
			// 		url
			// 	},
			// 	(err, response, body) => {
			// 		if (!err && response.statusCode === 200) {
			// 			resolve(body);
			// 		} else {
			// 			reject(
			// 				new Error(
			// 					`Fetching error has occured: ${err &&
			// 						err.message}, status code: ${
			// 						response.statusCode
			// 					}`
			// 				)
			// 			);
			// 		}
			// 	}
			// );
		});
	}
};
