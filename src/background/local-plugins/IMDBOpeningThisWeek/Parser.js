const cheerio = require('cheerio');
const DEFAULT_LOG = message => console.log(message);

module.exports = class Parser {
	constructor(options = {}) {
		this.log = options.log || DEFAULT_LOG;
	}

	parse(html) {
		const $ = cheerio.load(html);
		const sidebar = $('#sidebar .aux-content-widget-2 .rhs-body')[0];
		return $(sidebar)
			.children('.rhs-row')
			.map((i, e) => {
				const $e = $(e);
				const $title = $('.title a', $e);
				const title = $title.text();
				const url = $title.attr('href');
				return { id: title, title, url };
			})
			.get();
	}
};
