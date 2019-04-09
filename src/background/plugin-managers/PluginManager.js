import LocalPluginManager from './LocalPluginManager';
import NativePluginManager from './NativePluginManager';
import log from '../log';
import { setDefaultIcon, setLoadingIcon } from '../PopupIcon';

export default class PluginManager {
	constructor(nativeEnabled, dispatcher) {
		this.nativeEnabled = nativeEnabled;
		this.localPluginManager = new LocalPluginManager();
		this.nativePluginManager = new NativePluginManager(dispatcher);
		this.pluginCache = {};
	}

	// async
	loadPlugins() {
		log('Loading all plugins');

		const {
			localPluginManager,
			nativePluginManager,
			pluginCache,
			nativeEnabled
		} = this;

		const localPluginLoadedP = localPluginManager.loadPlugins();
		const nativePluginLoadedP = nativeEnabled
			? nativePluginManager.loadPlugins()
			: Promise.resolve([]);

		return localPluginLoadedP.then(localPlugins => {
			this.addPluginsToCache(localPlugins, 'LOCAL');
			return nativePluginLoadedP.then(nativePlugins => {
				this.addPluginsToCache(nativePlugins, 'NATIVE');
				return Object.values(pluginCache);
			});
		});
	}

	// plugins Array of plugin metadata
	// type LOCAL | NATIVE
	addPluginsToCache(plugins, type) {
		const { pluginCache } = this;
		plugins.forEach(
			plugin => (pluginCache[plugin.id] = { type, ...plugin })
		);
	}
	// async
	runPlugin(pluginID, options) {
		log(`Running plugin ${pluginID}`);

		const { pluginCache, localPluginManager, nativePluginManager } = this;
		const { type } = pluginCache[pluginID];

		// Set loading icon
		setLoadingIcon();

		var resP;

		switch (type) {
			case 'LOCAL':
				resP = localPluginManager.runPlugin(pluginID, options);
				break;
			case 'NATIVE':
				resP = nativePluginManager.runPlugin(pluginID, options);
				break;
		}

		return resP.then(results => {
			setDefaultIcon();
			return results;
		});
	}
}
