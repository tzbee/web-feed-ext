export default class ChromeStorage {
    constructor(chrome) {
        if (!chrome || !chrome.storage || !chrome.storage.local)
            throw new Error('Cannot access chrome storage');

        this.storage = chrome.storage.local;
    }

    /*
        Async
        returns Promise
    */
    saveFeeds(feeds, lastUpdateTS) {
        return new Promise(resolve => {
            this.storage.set(
                {
                    feeds,
                    lastUpdateTS
                },
                resolve
            );
        });
    }

    /*
        Async
        returns Promise
    */
    loadFeeds() {
        return new Promise(resolve => {
            this.storage.get(['feeds', 'lastUpdateTS'], data => {
                debugger;
                resolve(data || {});
            });
        });
    }
}
