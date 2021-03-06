import ChromeDispatcher from './ChromeDispatcher';
import FeedManager from './FeedManager';
import PluginManager from './plugin-managers/PluginManager';

import { hookEvents } from './events';
import openNewTab from './tab-context';

import log from './log';
import { runSequence } from '../utils/async-utils';

// Connect to host application
const port = chrome.runtime.connectNative('com.tzbee.webfeed');

var pluginManager = null;
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
		log('Host application found, using native plugin manager');
	} else {
		log('No host application found, using local plugin manager');
	}

	pluginManager = new PluginManager(nativeAppFound, dispatcher);
	feedManager = new FeedManager(pluginManager);

	// Load all plugins and feeds in the cache
	pluginManager.loadPlugins().then(() => {
		feedManager.loadFeeds().then(() => {
			hookEvents(
				dispatcher,
				feedManager,
				openNewTab,
				pluginManager,
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
	});
}, 500);
