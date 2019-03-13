import ChromeDispatcher from './ChromeDispatcher';
import FeedManager from './FeedManager';
import NativeCrawler from './NativeCrawler';
import LocalCrawler from './LocalCrawler';

import { hookEvents } from './events';
import openNewTab from './tab-context';

import log from './log';
import { runSequence } from './async';

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
		const EXAMPLE_FEEDS = require('./example-feeds.json');

		const fnQueue = EXAMPLE_FEEDS.map(exampleFeed =>
			feedManager.createFeed.bind(feedManager, exampleFeed)
		);

		runSequence(fnQueue, 0, 0).then(() => {
			feedManager.watchFeeds();
		});
	});
}, 500);
