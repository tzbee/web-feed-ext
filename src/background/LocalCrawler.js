import log from './log';
import LinkPlugin from './local-plugins/AllLink/Plugin';

/*
	Map holding available local plugins
*/
const linkPlugin = new LinkPlugin();

const PLUGIN_MAP = {
	[linkPlugin.id]: linkPlugin
};

const DEFAULT_PLUGIN_ID = Object.keys(PLUGIN_MAP)[0];

export default class LocalCrawler {
	/*
        Async
        returns Promise 
        resolve into Array of {Feed}
    */

	crawl(pluginID = DEFAULT_PLUGIN_ID, options = []) {
		log(`Running plugin ${pluginID}' in browser`);

		if (!pluginID)
			return Promise.reject(
				new Error('Cannot crawl: No command provided')
			);

		const plugin = PLUGIN_MAP[pluginID];

		if (!plugin) {
			throw new Error(`No plugin found with id ${pluginID}`);
		}

		// Options is an array, convert to map
		const optionsMap =
			options &&
			options.reduce((map, { key, value }) => {
				map[key] = value;
				return map;
			}, {});

		return plugin.run(optionsMap);
	}

	get() {
		return Object.keys(PLUGIN_MAP).map(pluginID => ({
			id: pluginID,
			args: PLUGIN_MAP[pluginID].args
		}));
	}
}
