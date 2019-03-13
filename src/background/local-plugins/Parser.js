const cheerio = require('cheerio');
const DEFAULT_LOG = message => console.log(message);

module.exports = class Parser {
    constructor(options = {}) {
        this.log = options.log || DEFAULT_LOG;
    }

    parse(html) {
        const $ = cheerio.load(html);
        return $('a').map((i, e) => {
            const $e = $(e);
            const title = $e.html();
            const url = $e.attr('href');
            return {
                id: url,
                title,
                url
            };
        }).get();
    }
};