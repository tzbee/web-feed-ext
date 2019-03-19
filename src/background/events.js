import log from './log';
import { getTotalNewFeedItemsCount } from './utils';
import { setDefaultIcon, setNewFeedsIcon } from './PopupIcon';

export const hookEvents = (
    dispatcher,
    feedManager,
    openNewTab,
    pluginManager,
    nativeSupport = true
) => {
    // Events from the feed logic
    feedManager.on('FEEDS_HAVE_CHANGED', feeds => {
        dispatcher.sendMessage('FEEDS', { feeds });

        debugger;

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
        }
    };

    var loadCommandHandler;

    if (nativeSupport) {
        loadCommandHandler = () => {
            log('Loading commands');
            dispatcher.sendMessageToNative('LOAD_COMMANDS');
        };

        // Event map from native
        const eventsFromNative = {
            'LOAD_COMMANDS:RESPONSE': ({ commands }) => {
                log('Commands loaded');
                dispatcher.sendMessage('LOAD_COMMANDS:RESPONSE', { commands });
            }
        };

        Object.keys(eventsFromNative).forEach(eventID => {
            const handler = eventsFromNative[eventID];
            dispatcher.onNativeMessage(eventID, handler);
        });
    } else {
        loadCommandHandler = () => {
            const pluginIDs = pluginManager.get();

            dispatcher.sendMessage('LOAD_COMMANDS:RESPONSE', {
                commands: pluginIDs
            });
        };
    }

    Object.assign(eventsFromPopup, {
        LOAD_COMMANDS: loadCommandHandler
    });

    Object.keys(eventsFromPopup).forEach(eventID => {
        const handler = eventsFromPopup[eventID];
        dispatcher.on(eventID, handler);
    });
};
