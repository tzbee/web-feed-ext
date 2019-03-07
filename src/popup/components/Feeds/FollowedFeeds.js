import * as React from "react";

import Feeds from "./Feeds";

const tsToLocaleDateString = ts => new Date(ts).toLocaleString();

export default ({
    feeds,
    followFeed,
    unfollowFeed,
    addURL,
    lastUpdateTS,
    openNewTab,
    markFeedAsRead,
    ...others
}) => {
    const handleAllNew = e => {
        e.stopPropagation();

        const allNewItemsURLs = feeds.reduce((allNewItemsURLs, feed) => {
            const newItemURLs = feed.items
                .filter(item => item.isNew)
                .map(newItem => newItem.url);
            allNewItemsURLs.push.apply(allNewItemsURLs, newItemURLs);
            return allNewItemsURLs;
        }, []);

        openNewTab && openNewTab(allNewItemsURLs);

        feeds.forEach(feed => markFeedAsRead && markFeedAsRead(feed.id));
    };

    const handleMarkAllRead = e => {
        e.stopPropagation();
        feeds.forEach(feed => markFeedAsRead && markFeedAsRead(feed.id));
    };

    return (
        <div className="FollowedFeeds">
            <div className="FollowedFeeds-header">
                {lastUpdateTS && (
                    <div className="FollowedFeeds-lastUpdateTS">
                        Last Updated: {tsToLocaleDateString(lastUpdateTS)}
                    </div>
                )}
                <div className="FollowedFeeds-openAllNew">
                    <a
                        href="#"
                        className="FollowedFeeds-openAllNew"
                        onClick={handleAllNew}
                    >
                        Open All New
                    </a>
                </div>
                <div className="FollowedFeeds-markAllRead">
                    <a
                        href="#"
                        className="FollowedFeeds-markAllRead"
                        onClick={handleMarkAllRead}
                    >
                        Mark All Read
                    </a>
                </div>
            </div>
            <Feeds
                feeds={feeds}
                markFeedAsRead={markFeedAsRead}
                openNewTab={openNewTab}
                {...others}
            />
        </div>
    );
};
