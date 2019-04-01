import './FeedItems.scss';

import * as React from 'react';

import NewItemCounter from '../NewItemCounter/NewItemCounter';

const EmptyFeedItems = () => (
    <div className="FeedItems-empty"> No Feed Items </div>
);

export default ({
    feedID,
    items,
    openNewTab,
    markItemAsRead,
    banItemIDFromFeed,
    toggleItemFolding
}) => {
    const handleMarkFeedItemAsRead = itemID => markItemAsRead(feedID, itemID);

    const handleBanItemID = itemID => {
        banItemIDFromFeed(itemID, feedID);
    };

    return items && items.length > 0 ? (
        <ul className="FeedItems">
            {items.map((item, i) => (
                <FeedItem
                    key={'fi-' + item.id + '-' + i}
                    item={item}
                    isFolded={item.isFolded}
                    openNewTab={openNewTab}
                    markItemAsRead={handleMarkFeedItemAsRead}
                    banItemID={handleBanItemID}
                    toggleItemFolding={toggleItemFolding}
                />
            ))}
        </ul>
    ) : (
        <EmptyFeedItems />
    );
};

const FeedItem = ({
    item: { id, title, img, isNew, url, data = {} },
    isFolded = true,
    openNewTab,
    markItemAsRead,
    banItemID,
    toggleItemFolding
}) => {
    const handleFollowLink = () => {
        openNewTab && url && openNewTab(url);
        markItemAsRead && markItemAsRead(id);
    };

    const handleNewItemCounterClick = () => {
        markItemAsRead && markItemAsRead(id);
    };

    const handleBanItemID = e => {
        e.stopPropagation();
        banItemID(id);
    };

    const handleFoldClick = e => {
        e.stopPropagation();
        toggleItemFolding && toggleItemFolding(id, !isFolded);
    };

    const foldedClass = isFolded ? 'FeedItems-folded' : 'FeedItem-unfolded';

    return (
        <li className="FeedItem" title={url} onClick={handleFoldClick}>
            <div className="FeedItem-info">
                <div className="FeedItem-title">{title || id}</div>
                <div className="FeedItem-newNotification">
                    {isNew ? (
                        <NewItemCounter
                            markAsRead={handleNewItemCounterClick}
                        />
                    ) : null}
                </div>
                <div className="FeedItem-toolbox">
                    <a
                        className="FeedItem-banItemIDBtn FeedItem-toolboxItem"
                        href="#"
                        onClick={handleBanItemID}
                    >
                        Ban item ID
                    </a>
                    <a
                        className="FeedItem-foldUnfold FeedItem-toolboxItem"
                        href="#"
                        onClick={handleFollowLink}
                    >
                        Go to link
                    </a>
                </div>
            </div>
            <FeedItemDetails
                data={Object.assign({}, data, { title, url, img })}
                foldedClass={foldedClass}
            />
        </li>
    );
};

const FeedItemDetails = ({ data, foldedClass }) => {
    return (
        <ul className={`FeedItem-details ${foldedClass}`}>
            {Object.keys(data).map(propKey => {
                return (
                    data[propKey] && (
                        <li className="FeedItem-detailsProp">
                            <div className="FeedItem-detailsPropItem FeedItem-detailsPropKey">
                                {propKey}
                            </div>
                            <div className="FeedItem-detailsPropItem FeedItem-detailsPropValue">
                                <PropValue
                                    propKey={propKey}
                                    propValue={data[propKey]}
                                />
                            </div>
                        </li>
                    )
                );
            })}
        </ul>
    );
};

const PropValue = ({ propKey, propValue }) => {
    const valueMap = {
        img: ImgPropValue
    };

    const ReactElement = propKey === 'img' ? ImgPropValue : TextPropValue;

    return (
        <div className="PropValue">
            <ReactElement value={propValue} />
        </div>
    );
};

const TextPropValue = ({ value }) => {
    return <div className="TextPropValue">{value}</div>;
};

const ImgPropValue = ({ value }) => {
    return (
        <div className="ImgPropValue">
            <img src={value} />
        </div>
    );
};
