import * as React from "react";

import NewItemCounter from "../NewItemCounter/NewItemCounter";

const getNewItemCount = items => items.filter(item => item.isNew).length;

export default ({
    feed,
    followFeed,
    unfollowFeed,
    editFeed,
    deleteFeed,
    markFeedAsRead,
    openNewTab,
    viewItems
}) => {
    const { id, title, description, items, lastUpdateTS, followed } = feed;

    const handleFollow = () => {
        followFeed && followFeed(id);
    };

    const handleUnfollow = () => {
        unfollowFeed && unfollowFeed(id);
    };

    const newItemCount = items && getNewItemCount(items);

    const getRelativeTime = () => {
        if (!lastUpdateTS) {
            return null;
        }

        const now = Date.now();
        const tsDiff = now - lastUpdateTS; // in ms

        const toSec = Math.floor(tsDiff / 1000);
        const toMin = Math.floor(toSec / 60);
        const toHour = Math.floor(toMin / 60);
        const toDays = Math.floor(toHour / 24);

        const valueLabels = [
            {
                value: toDays,
                label: "days"
            },
            {
                value: toHour,
                label: "h"
            },
            {
                value: toMin,
                label: "min"
            },
            {
                value: toSec,
                label: "sec"
            }
        ];

        const DEFAULT_VALUE_LABEL = { value: 0, label: "sec" };
        const { value, label } =
            valueLabels.find(valueLabel => valueLabel.value >= 1) ||
            DEFAULT_VALUE_LABEL;

        return value + " " + label;
    };

    const relativeTime = getRelativeTime();
    const relativeTimeMessage = relativeTime ? relativeTime + " ago" : "";

    const handleEdit = e => {
        e.stopPropagation();
        editFeed && editFeed(id);
    };

    const handleDelete = e => {
        e.stopPropagation();
        deleteFeed && deleteFeed(id);
    };

    const handleSelect = () => {
        viewItems && viewItems(id);
    };

    const handleMarkFeedAsRead = () => markFeedAsRead && markFeedAsRead(id);

    const handleOpenNewItems = e => {
        e.stopPropagation();

        const newItems = items.filter(item => item.isNew);
        const newItemsURLs = newItems.map(newItem => newItem.url);

        openNewTab && openNewTab(newItemsURLs);
        markFeedAsRead && markFeedAsRead(id);
    };

    return (
        <li className="Feed" onClick={handleSelect} title={description}>
            <table className="Feed-data">
                <tbody>
                    <tr>
                        <td className="Feed-infoMain">
                            <div className="Feed-id">{`${title}(${(items &&
                                items.length) ||
                                0})`}</div>
                            <div className="Feed-ts">{relativeTimeMessage}</div>
                        </td>
                        <td className="Feed-newItemCount">
                            {(newItemCount || null) && (
                                <NewItemCounter
                                    counter={newItemCount}
                                    markAsRead={handleMarkFeedAsRead}
                                />
                            )}
                        </td>
                        <td className="Feed-followUnfollow">
                            <FollowBox
                                followed={followed}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                            />
                        </td>
                        <td className="Feed-toolboxItemWrapper">
                            <a
                                className="Feed-editBtn Feed-toolboxItem fa fa-fw fa-wrench"
                                title="Edit feed"
                                href="#"
                                onClick={handleEdit}
                            />
                        </td>
                        <td className="Feed-toolboxItemWrapper">
                            <a
                                className="Feed-toolboxItem Feed-openAllBtn fa fa-fw fa-external-link-square"
                                title="Open unread"
                                href="#"
                                onClick={handleOpenNewItems}
                            />
                        </td>
                        <td className="Feed-toolboxItemWrapper">
                            <a
                                className="Feed-deleteBtn Feed-toolboxItem fa fa-fw fa-times"
                                title="Delete feed"
                                href="#"
                                onClick={handleDelete}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
    );
};

const FollowBox = ({ followed, onFollow, onUnfollow }) => {
    const handleFollow = e => {
        e.stopPropagation();
        onFollow && onFollow();
    };

    const handleUnfollow = e => {
        e.stopPropagation();
        onUnfollow && onUnfollow();
    };

    return (
        <div className="FollowBox">
            {!followed ? (
                <button
                    className="Feed-followUnfollow-btn Feed-follow-btn"
                    onClick={handleFollow}
                >
                    Follow
                </button>
            ) : (
                <button
                    className="Feed-followUnfollow-btn Feed-unfollow-btn"
                    onClick={handleUnfollow}
                >
                    Unfollow
                </button>
            )}
        </div>
    );
};
