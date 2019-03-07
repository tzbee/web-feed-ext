import "./Feeds.scss";

import * as React from "react";

import FeedListItem from "./FeedListItem";

/*
    Feed @props
        id
        urls
        parser
*/
const Feeds = ({ feeds, createNewFeed, ...others }) => {
    if (feeds && feeds.length > 0) {
        return (
            <ul className="Feeds">
                {feeds.map(feed => (
                    <FeedListItem
                        key={"f-" + feed.id}
                        feed={feed}
                        {...others}
                    />
                ))}
            </ul>
        );
    } else {
        return (
            <div className="Feeds">
                <div className="Feeds-noFeeds">
                    No feeds
                    <div>
                        <a
                            className="Feeds-noFeedsAdd"
                            href="#"
                            onClick={createNewFeed}
                        >
                            Add one
                        </a>
                    </div>
                </div>
            </div>
        );
    }
};

export default Feeds;
