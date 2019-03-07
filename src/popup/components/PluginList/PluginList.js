import * as React from 'react';

const PluginItem = ({ plugin, createFeedFromPlugin }) => {
    const handleCreateFeed = command => {
        if (!createFeedFromPlugin) return;

        const feed = {
            pluginID: plugin.id,
            commandID: command.id,
            args: {}
        };

        createFeedFromPlugin(feed);
    };

    return <div className='PluginItem'>
				{plugin.id}
				{plugin.commands.map(command=>
					<CommandItem 
						key={`ci-${plugin.id}-${command}`} 
						command={command} 
						createFeedFromCommand={handleCreateFeed}
					/>)}
			</div>;
};

const CommandItem = ({ command, createFeedFromCommand }) => {
    const handleCreateFeed = () => createFeedFromCommand && createFeedFromCommand(command);

    return (<div className='CommandItem'>
    	{command.id}
    	<button onClick={handleCreateFeed}>Create Feed</button>
    </div>);
};

export default ({ plugins, setEditedFeed }) => {
    return <div className='PluginList'>
		<h3>Available plugins</h3>
		{plugins.map(plugin=>(<PluginItem key={'pi-'+plugin.id} plugin={plugin} createFeedFromPlugin={setEditedFeed}/>))}
	</div>;
};