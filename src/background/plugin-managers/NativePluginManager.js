import log from '../log';

export default class NativePluginManager {
	constructor(dispatcher) {
		this.dispatcher = dispatcher;
	}

	// Async
	loadPlugins() {
		log('Loading native plugins');

		const { dispatcher } = this;

		const loadedP = new Promise(resolve => {
			dispatcher.onNativeMessage(
				'LOAD_COMMANDS:RESPONSE',
				({ commands }) => {
					log('Commands loaded');
					resolve(commands);
				}
			);
		});

		log('Loading native plugins');

		dispatcher.sendMessageToNative('LOAD_COMMANDS');

		return loadedP;
	}

	/*
        Async
        returns Promise 
        resolve into Array of {Feed}
    */
	runPlugin(pluginID, options = []) {
		if (!pluginID)
			return Promise.reject(
				new Error('Cannot run native plugin : No id provided')
			);

		return new Promise(resolve => {
			log(`Running command ${pluginID}' with native app`);

			const { dispatcher } = this;

			// Options is an array, convert to map
			const optionsMap =
				options &&
				options.reduce((map, { key, value }) => {
					map[key] = value;
					return map;
				}, {});

			dispatcher.sendMessageToNative('CRAWL', {
				pluginID,
				options: optionsMap
			});

			dispatcher.onNativeMessage('CRAWL:RESULTS', ({ results }) => {
				log(`Crawling response received from native app`);
				resolve(results);
			});
		});
	}
}
