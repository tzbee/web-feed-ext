import log from '../log';

/*
	Map holding available local plugins
*/
const REGISTERED_PLUGINS = [
	require('../local-plugins/AllLink/Plugin'),
	require('../local-plugins/IMDBOpeningThisWeek/Plugin')
];

const PLUGIN_MAP = REGISTERED_PLUGINS.reduce((pluginMap, Plugin) => {
	// Create plugin instance
	const plugin = new Plugin();
	pluginMap[plugin.id] = plugin;
	return pluginMap;
}, {});

const DEFAULT_PLUGIN_ID = Object.keys(PLUGIN_MAP)[0];

export default class LocalPluginManager {
	/*
		Async
		returns Promise
		resolves into an Array of serialized Plugins
	*/
	loadPlugins() {
		log('Loading local plugins');

		const plugins = Object.keys(PLUGIN_MAP).map(pluginID => ({
			id: pluginID,
			args: PLUGIN_MAP[pluginID].args
		}));
		return Promise.resolve(plugins);
	}

	/*
        Async
        returns Promise 
        resolves into Array of {Feed}
    */
	runPlugin(pluginID = DEFAULT_PLUGIN_ID, options = []) {
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
}
