/*
    Client Feed logic

    Feed
        id
        parser
        urls
        items
        isLoading
    Items
        Array of 
            id
            title
            url
            img
            data
*/

import log from './log';
import EventEmitter from 'wolfy87-eventemitter';
import async from './async';
import runQuery from './runQuery';
import uuidv1 from 'uuid/v1';
import ChromeStorage from './ChromeStorage';

const createID = () => uuidv1();
const storage = new ChromeStorage(chrome);
const { runSequence, waitRandom } = async;

const DEFAULT_UPDATE_TIMER = 0.5 * 60 * 60 * 1000; // in ms
const DEFAULT_DATA_FIELDS = [
    { name: 'id', label: 'ID' },
    { name: 'url', label: 'URL' },
    { name: 'title', label: 'Title' }
];

const DEFAULT_TITLE = 'No name';
const DEFAULT_DESCRIPTION = '';

const DEFAULT_FEED_PROPS = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    commandID: '', // required
    updateTimer: DEFAULT_UPDATE_TIMER,
    args: {},
    query: {},
    followed: false,
    commandOptions: '',
    dataFields: DEFAULT_DATA_FIELDS,
    bannedIDs: [] // Banned item IDs
};

/*
    Events
        FEEDS_HAVE_CHANGED (feeds, [feed]) =>
        UPDATE_START
        UPDATE_STOP
*/
export default class FeedManager extends EventEmitter {
    constructor(crawler) {
        super();

        this.crawler = crawler;

        // Feed cache
        this.feeds = {};

        // Counter for the number of ongoing updates
        this.updateCount = 0;

        // Timestamp of last feed update
        this.lastUpdateTS = null;
    }

    _normalizeFeedOptions(options) {
        // Remove empty strings props
        for (let prop in options) {
            if (options[prop] === '') {
                delete options[prop];
            }
        }
        return options;
    }

    /*
        Async
        Creates a new feed and save it
    */
    createFeed(options) {
        const { commandID } = options;
        if (!commandID) throw new Error('Cannot create feed: command required');

        log(`Creating feed from  command ${commandID}`);

        // Create a new feed object initialized with default props
        // Then assign the options
        // And create a new unique id
        const feed = Object.assign(
            {},
            DEFAULT_FEED_PROPS,
            { id: createID() },
            this._normalizeFeedOptions(options)
        );

        return this._saveFeed(feed).then(() => feed);
    }

    /*
        Async
        Edits an existing feed and save it 
    */
    editFeed(options) {
        const { id, commandID } = options;
        if (!commandID) throw new Error('Cannot edit feed:  command required');

        log(`Editing feed ${options.id}`);

        const feed = this.getFeed(id);
        if (!feed)
            throw new Error(
                'Cannot edit feed ${options.id}: it does not exist'
            );

        const newFeed = Object.assign({}, feed, options);

        return this._saveFeed(newFeed).then(() => newFeed);
    }

    /*
        Async

    */
    _saveFeed(feed) {
        this.feeds[feed.id] = feed;
        return this._saveFeeds().then(() => {
            const feeds = this.getFeeds();
            this.emit('FEEDS_HAVE_CHANGED', feeds, feed);
            return feeds;
        });
    }

    createAndUpdateFeed(options) {
        return this.createFeed(options).then(feed => {
            if (feed.followed) {
                return this._updateFeed(feed);
            } else {
                return feed;
            }
        });
    }

    editAndUpdateFeed(options) {
        return this.editFeed(options).then(feed => {
            if (feed.followed) {
                return this._updateFeed(feed);
            } else {
                return feed;
            }
        });
    }

    // Merge the data fields with the default ones
    _mergeDataFields(dataFields) {
        const arrayToMap = this.arrayToMap;
        const keyProp = 'name';
        const mergedMap = Object.assign(
            {},
            arrayToMap(DEFAULT_DATA_FIELDS, keyProp),
            arrayToMap(dataFields || [], keyProp)
        );
        return Object.values(mergedMap);
    }

    arrayToMap(arr, keyProp) {
        return arr.reduce((resultMap, e) => {
            const value = e[keyProp];
            if (value) {
                resultMap[value] = e;
            }
            return resultMap;
        }, {});
    }

    /*
        Async
        Create, update and save a feed
    */
    createAndFollowFeed(parserID, urls) {
        log('Following feed');

        const feed = this._createFeed(parserID, urls);

        // Save the feed

        this.feeds[feed.id] = feed;
        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), feed);

            // Update and start watching the feed
            this.watchFeed(feed.id);
        });
    }

    /*
        Async
    */
    followFeed(id) {
        log('Following feed ' + id);

        const feed = this.getFeed(id);
        feed.followed = true;
        this.feeds[feed.id] = feed;
        this._saveFeeds().then(() => {
            // Update and start watching the feed
            this.watchFeed(id);
        });
    }

    saveAndUpdateFeed(feed) {
        log(`Saving and updating feed ${feed.id}`);

        this.feeds[feed.id] = feed;

        return this._updateFeed(feed).then(() => {
            return this._saveFeeds().then(() => {
                this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), feed);
            });
        });
    }

    getFeedsByParserURL(url) {
        const parsers = this.parserCache;

        log(`Finding feeds by parser url ${url}..`);

        const feeds = this.getFeeds();

        const res = feeds.filter(feed => {
            const parser = parsers.getCrawlerByID(feed.parser);

            if (!parser) {
                log(`No parser ${feed.parser} found`);
                return false;
            }

            const { test } = parser;

            if (test === undefined) {
                log(`No test found for parser ${feed.parser}`);
            }

            return test && test.test(url);
        });

        if (res.length > 0) {
            log(`${res.length} feeds found for parser url ${url}`);
        } else {
            log(`No feeds found for parser url ${url}`);
        }

        return res;
    }

    /*
        Async
        returns Promes when saving is done
    */
    _saveFeeds() {
        return storage.saveFeeds(this.feeds, this.lastUpdateTS);
    }

    loadFeeds() {
        return storage.loadFeeds().then(config => {
            const { feeds = {}, lastUpdateTS = null } = config;
            this.feeds = feeds;
            this.lastUpdateTS = lastUpdateTS;
            return config;
        });
    }

    /*
        Start watching feeds
        Update all feeds every {min} to {max} ms
    */
    watchFeeds() {
        const feeds = this.getFeeds();

        log(`Watching ${feeds.length} feeds..`);

        const fnQueue = feeds.map(feed => this.watchFeed.bind(this, feed.id));
        return runSequence(fnQueue);
    }

    getFeed(id) {
        const feed = this.feeds[id];
        if (!feed) throw new Error(`No feed with ID ${id}`);
        return feed;
    }

    watchFeed(feedID) {
        log(`Watching feed ${feedID}..`);

        const feed = this.getFeed(feedID);

        if (!feed) {
            log(`Cannot watch feed ${feedID}: It does not exist`);
            return Promise.reject();
        }

        if (!feed.followed) {
            log(`Cannot watch feed ${feedID}: It is not followed`);
            return Promise.reject();
        }

        const { updateTimer } = feed;

        this._updateFeed(feed)
            .then(feed => {
                this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), feed, 'ITEMS');
            })
            .catch(err =>
                log(`Problem while updating feed ${feedID}: ${err.message}`)
            )
            .then(() => {
                waitRandom(updateTimer, updateTimer + 60 * 1000).then(
                    this.watchFeed.bind(this, feedID)
                );
            });

        return Promise.resolve();
    }

    addURLToFeed(url, feedID) {
        const feed = this.getFeed(feedID);

        feed.urls.push(url);

        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), feed);
        });
    }

    /*
        Async
        Update all feeds and returns a Promise resolving in the updated feeds
    */
    updateAllFeeds() {
        const feeds = this.getFeeds();

        log(`Updating ${feeds.length} feeds..`);

        const fnQueue = feeds.map(feed => this._updateFeed.bind(this, feed));
        return runSequence(fnQueue);
    }

    _updateCount(diff, feed) {
        if (this.updateCount + diff < 0) return;

        // In the case where nothing is currently updating
        if (this.updateCount === 0) {
            this.emit('UPDATE_START', feed);
        }

        // Update the counter
        this.updateCount += diff;

        // In the case where there
        // is no active update anymore
        if (this.updateCount === 0) {
            this.emit('UPDATE_STOP', feed);
        }
    }

    /*
        Update a feed and returns the updated feed
    */
    _updateFeed(feed) {
        log(`Updating feed ${feed.id}..`);

        // Update the counter
        this._updateCount(1, feed);

        if (!this.crawler || !this.crawler.crawl) {
            return Promise.reject(new Error('No crawler found'));
        }

        const crawl = this.crawler.crawl.bind(this.crawler);
        const { commandID, args: commandOptions } = feed;

        this._setLoading(feed.id, true);

        // Start crawling the urls
        return crawl(commandID, commandOptions)
            .then(results => this._filterResults(results, feed.bannedIDs))
            .then(results => this._handleResults(results, feed))
            .catch(err => {
                log('Crawling ERROR: ' + err.message);

                this._setLoading(feed.id, false);

                // The crawling has encountered a problem
                // This feed is done updating
                this._updateCount(-1, feed);
            });
    }

    _setLoading(feedID, loadingState) {
        const feed = this.getFeed(feedID);
        feed.isLoading = loadingState;
        this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), feed);
    }

    /*
        Filter duplicate results and run the query
    */
    _filterResults(results, bannedIDs) {
        // Remove duplicate results
        const resultMap = results.reduce((resultMap, result) => {
            resultMap[result.id] = result;
            return resultMap;
        }, {});

        const noDuplicatesResults = Object.values(resultMap);

        const filteredBannedIDs = noDuplicatesResults.filter(res => {
            return !bannedIDs.includes(res.id);
        });

        return filteredBannedIDs;
    }

    /*
        Handles feed update results
    */
    _handleResults(results, feed) {
        // The crawling ended successfully,
        // Update the counter
        this._updateCount(-1, feed);

        // Update global timestamp and feed timestamp
        const now = Date.now();
        this.lastUpdateTS = now;
        feed.lastUpdateTS = now;

        this._setLoading(feed.id, false);

        if (results && results.length > 0) {
            log(`${results.length} items found for feed ${feed.id}`);

            // Set a "new" flag to each results
            const newItems = this._updateNewItems(feed, results);
            log(`${newItems.length} new items found for feed ${feed.id}`);
        } else {
            log(`No items found for feed ${feed.id}`);
        }

        // Update the feed items and save
        feed.items = results;
        return this._saveFeeds().then(() => feed);
    }

    _updateNewItems(feed, nextItems) {
        const { items } = feed;

        // If the feed had no items every incoming item is new
        if (!items) return nextItems.map(item => (item.isNew = true) && item);

        return nextItems.filter(nextItem => {
            const isItemNew =
                items.find(item => nextItem.id === item.id) === undefined;
            const isItemUnread =
                items.find(item => nextItem.id === item.id && item.isNew) !==
                undefined;
            nextItem.isNew = isItemNew || isItemUnread;
            return isItemNew || isItemUnread;
        });
    }

    unfollowFeed(id) {
        const feed = this.getFeed(id);
        feed.followed = false;
        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds());
        });
    }

    deleteFeed(id) {
        delete this.feeds[id];
        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds());
        });
    }

    markFeedItemAsRead(id, itemID) {
        if (!id || !itemID) return;

        const subscribedFeed = this.getFeed(id);

        if (!subscribedFeed) return;

        const { items } = subscribedFeed;

        if (!items) return;

        const item = items.find(({ id }) => id === itemID);
        item.isNew = false;

        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), subscribedFeed);
        });
    }

    markFeedAsRead(id) {
        const subscribedFeed = this.getFeed(id);

        const { items } = subscribedFeed;

        if (!items) return;

        items.forEach(item => {
            item.isNew = false;
        });

        return this._saveFeeds().then(() => {
            this.emit('FEEDS_HAVE_CHANGED', this.getFeeds(), subscribedFeed);
        });
    }

    getFeeds() {
        return Object.values(this.feeds);
    }

    banItemIDFromFeed(itemID, feedID) {
        log(`Banning id ${itemID} from feed ${feedID}`);

        const feed = this.getFeed(feedID);

        if (!feed.bannedIDs) {
            feed.bannedIDs = [];
        }

        feed.bannedIDs.push(itemID);
        this._saveFeed(feed);

        log(`Item ${itemID} banned from feed ${feedID}`);
    }
}
