
export const isString = arg => typeof arg === 'string';
export const isArray = arg => arg.constructor.name === 'Array';

/*
    Async
    Get current page url
    @returns a promise resolving the url
*/
export const getCurrentPageURL = () => new Promise((resolve, reject) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        if (tabs.length > 0) {
            resolve(tabs[0].url);
        } else {
            reject(new Error('No current tab'));
        }
    });
});

export const getTotalNewFeedItemsCount = feeds => {
    return feeds.reduce((count, feed) => {
        if (!feed || !feed.items) return count;
        return count + feed.items.reduce((feedItemCount, item) => {
            if (item.isNew) return feedItemCount + 1;
            else return feedItemCount;
        }, 0);
    }, 0);
};