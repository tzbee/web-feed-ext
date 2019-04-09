import { getTotalNewFeedItemsCount } from '../utils/utils';
import { setDefaultIcon, setNewFeedsIcon } from './PopupIcon';

export const hookEvents = (
    dispatcher,
    feedManager,
    openNewTab,
    pluginManager
) => {
    // Events from the feed logic
    feedManager.on('FEEDS_HAVE_CHANGED', feeds => {
        dispatcher.sendMessage('FEEDS', { feeds });

        // Update the popup icon when new feeds are available
        if (getTotalNewFeedItemsCount(feeds) > 0) {
            setNewFeedsIcon();
        } else {
            setDefaultIcon();
        }
    });

    // Event map from popup
    const eventsFromPopup = {
        CREATE_FEED: ({ feed }) => {
            if (!feed.id) {
                feedManager.createAndUpdateFeed(feed);
            } else {
                feedManager.editAndUpdateFeed(feed);
            }
        },
        LOAD_FEEDS: () => {
            const feeds = feedManager.getFeeds();
            dispatcher.sendMessage('FEEDS', { feeds });
        },
        DELETE_FEED: ({ id }) => {
            feedManager.deleteFeed(id);
        },
        UNFOLLOW_FEED: ({ id }) => {
            feedManager.unfollowFeed(id);
        },
        FOLLOW_FEED: ({ id }) => {
            feedManager.followFeed(id);
        },
        MARK_FEED_AS_READ: ({ id }) => {
            feedManager.markFeedAsRead(id);
        },
        MARK_FEED_ITEM_AS_READ: ({ feedID, itemID }) => {
            feedManager.markFeedItemAsRead(feedID, itemID);
        },
        // Tab management
        OPEN_NEW_TAB: ({ url }) => openNewTab(url),
        BAN_ITEM_ID_FROM_FEED: ({ itemID, feedID }) => {
            feedManager.banItemIDFromFeed(itemID, feedID);
        },
        LOAD_COMMANDS: () => {
            pluginManager.loadPlugins().then(commands => {
                dispatcher.sendMessage('LOAD_COMMANDS:RESPONSE', {
                    commands
                });
            });
        }
    };

    Object.keys(eventsFromPopup).forEach(eventID => {
        const handler = eventsFromPopup[eventID];
        dispatcher.on(eventID, handler);
    });
};
