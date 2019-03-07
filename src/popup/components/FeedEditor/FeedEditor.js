import * as React from 'react';
import TabPanel from '../Tabs/TabPanel';

import FeedEditorGeneral from '../FeedEditor/FeedEditorGeneral';
import FeedEditorCommand from '../FeedEditor/FeedEditorCommand';
import FeedEditorAdvanced from '../FeedEditor/FeedEditorAdvanced';

const CLASS_MAP = {
    tabNavItem: 'FeedEditor-tabNavItem'
};

export default ({ feed, commandIDs, selectTabID, selectedTabID, saveFeed, setEditedFeed }) => {

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

    return <div className='FeedEditorPanel'>
                <div className='FeedEditorPanel-header'>
                          { feed.id ?
                            'Edit Feed'  :
                            'Create Feed' }
                </div>
                <form action='#' onSubmit={handleSaveFeed}>
                    <TabPanel tabs={tabs} selectedTabID={selectedTabID} selectTabID={selectTabID} classMap={CLASS_MAP}>
                        <FeedEditorGeneral feed={feed}/>
                        <FeedEditorCommand feed={feed} commandIDs={commandIDs}/>
                        <FeedEditorAdvanced feed={feed}/>
                    </TabPanel>
                    <button>Save</button>
                </form>
            </div>;
};