import * as React from 'react';
import TabPanel from './TabPanel';

import FeedEditorGeneral from '../FeedEditor/FeedEditorGeneral';
import FeedEditorCommand from '../FeedEditor/FeedEditorCommand';
import FeedEditorAdvanced from '../FeedEditor/FeedEditorAdvanced';

export default ({ feed, plugins, commandIDs, selectTabID, selectedTabID, saveFeed, setEditedFeed }) => {

    const handleSaveFeed = () => {
        saveFeed && saveFeed(feed);
    };

    const tabs = [{
        id: 'GENERAL',
        title: 'General',
        data: { setEditedFeed }
    }, {
        id: 'COMMAND',
        title: 'Command',
        data: { setEditedFeed }
    }, {
        id: 'ADVANCED',
        title: 'Advanced',
        data: { setEditedFeed }
    }];

    const pluginIDs = plugins.map(plugin => plugin.id);

    return <div className='FeedEditorPanel'>
                <form action='#' onSubmit={handleSaveFeed}>
                    <TabPanel tabs={tabs} selectedTabID={selectedTabID} selectTabID={selectTabID}>
                        <FeedEditorGeneral feed={feed}/>
                        <FeedEditorCommand feed={feed} pluginIDs={pluginIDs} commandIDs={commandIDs}/>
                        <FeedEditorAdvanced feed={feed}/>
                    </TabPanel>
                    <button>Save</button>
                </form>
            </div>;
};