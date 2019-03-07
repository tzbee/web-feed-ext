import ChromeDispatcher from './ChromeDispatcher';
import FeedManager from './FeedManager';
import NativeCrawler from './NativeCrawler';
import { hookEvents } from './events';
import openNewTab from './tab-context';

// Connect to host application
const port = chrome.runtime.connectNative('com.tzbee.crawler');
var crawler = null;


if (!port) {
	crawler = new NativeCrawler(dispatcher);
}

const dispatcher = new ChromeDispatcher(chrome, port);
const feedManager = new FeedManager(crawler);

// Load all feeds in the cache
feedManager.loadFeeds().then(() => {
	hookEvents(dispatcher, feedManager, openNewTab);
	feedManager.watchFeeds();
});
