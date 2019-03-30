const cheerio = require('cheerio');
const DEFAULT_LOG = message => console.log(message);

module.exports = class Parser {
    constructor(options = {}) {
        this.log = options.log || DEFAULT_LOG;
    }

    parse(html) {
        const $ = cheerio.load(html);
        const regularLinks = $('a')
            .map((i, e) => {
                const $e = $(e);
                const title = $e.text();
                const url = $e.attr('href');
                return {
                    id: url,
                    title,
                    url
                };
            })
            .get();

        const imgLinks = $('img')
            .map((i, e) => {
                const $e = $(e);
                const title = $e.attr('alt');
                const url = $e.attr('src');
                return {
                    id: url,
                    title,
                    url,
                    img: url
                };
            })
            .get();

        return regularLinks.concat(imgLinks);
    }
};
