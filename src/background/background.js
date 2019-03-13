import ChromeDispatcher from './ChromeDispatcher';
import FeedManager from './FeedManager';
import NativeCrawler from './NativeCrawler';
import LocalCrawler from './LocalCrawler';

import { hookEvents } from './events';
import openNewTab from './tab-context';

import log from './log';

// Connect to host application
const port = chrome.runtime.connectNative('com.tzbee.crawler');

var crawler = null;
var dispatcher;
var feedManager;

var nativeAppFound = true;

port.onDisconnect.addListener(() => {
	if (chrome.runtime.lastError) {
		nativeAppFound = false;
	}
});

setTimeout(() => {
	dispatcher = new ChromeDispatcher(chrome, port);

	if (nativeAppFound) {
		log('Host application found, using native crawler');
		crawler = new NativeCrawler(dispatcher);
	} else {
		/*
		If no host app was found or was unable to connect to,
		use the local crawler
	*/
		log('No host application found, using local crawler');
		crawler = new LocalCrawler();
	}

	feedManager = new FeedManager(crawler);

	// Load all feeds in the cache
	feedManager.loadFeeds().then(() => {
		hookEvents(
			dispatcher,
			feedManager,
			openNewTab,
			crawler,
			nativeAppFound
		);

		// TODO Set example feed only on first startup
		// TODO Load the example(s) from a file
		const EXAMPLE_FEED = {
			id: '-1',
			title: 'Example feed',
			description: 'This is an example feed',
			commandID: 'default-link-crawler-plugin',
			args: [
				{
					title: 'URLs',
					key: 'urls',
					type: 'Array',
					default: [],
					value: ['https://en.wikipedia.org/wiki/Main_Page']
				}
			]
		};

		feedManager.createFeed(EXAMPLE_FEED).then(feed => {
			feedManager.watchFeeds();
		});
	});
}, 500);
