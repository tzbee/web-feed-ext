import log from './log';

export default class NativeCrawler {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    /*
        Async
        returns Promise 
        resolve into Array of {Feed}
    */
    crawl(commandID, options) {
        if (!commandID) return Promise.reject(new Error('Cannot crawl: No command provided'));

        return new Promise(resolve => {
            log(`Running command ${commandID}' with native app`);

            const { dispatcher } = this;

            // Options is an array, convert to map
            const optionsMap = options && options.reduce((map, { key, value }) => {
                map[key] = value;
                return map;
            }, {});

            dispatcher.sendMessageToNative('CRAWL', { commandID, options: optionsMap });

            dispatcher.onNativeMessage('CRAWL:RESULTS', ({ results }) => {
                log(`Crawling response received from native app`);
                resolve(results);
            });
        });
    };
};