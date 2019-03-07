// Commands 

export const saveFeed = feed => () => {
    chrome.runtime.sendMessage({ command: 'CREATE_FEED', feed });
};

export const deleteFeed = id => () => {
    chrome.runtime.sendMessage({ command: 'DELETE_FEED', id });
};

export const unfollowFeed = id => () => {
    chrome.runtime.sendMessage({ command: 'UNFOLLOW_FEED', id });
};

export const followFeed = id => () => {
    chrome.runtime.sendMessage({ command: 'FOLLOW_FEED', id });
};

export const markFeedAsRead = id => () => {
    chrome.runtime.sendMessage({ command: 'MARK_FEED_AS_READ', id });
};

export const markItemAsRead = (feedID, itemID) => () => {
    chrome.runtime.sendMessage({ command: 'MARK_FEED_ITEM_AS_READ', feedID, itemID });
};

export const openNewTab = url => () => {
    chrome.runtime.sendMessage({ command: 'OPEN_NEW_TAB', url });
};

export const banItemIDFromFeed = (itemID, feedID) => () => {
    chrome.runtime.sendMessage({ command: 'BAN_ITEM_ID_FROM_FEED', itemID, feedID });
};