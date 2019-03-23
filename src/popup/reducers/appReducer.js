const DEFAULT_MAIN_TAB = 'FEED_LIST';
const DEFAULT_FEED_EDITOR_TAB = 'GENERAL';

// The state of the current feed editor
const DEFAULT_EDITED_FEED = {
    tab: DEFAULT_FEED_EDITOR_TAB,
    feedID: '',
    data: {
        title: '',
        description: '',
        commandID: '',
        args: [],
        query: {}
    }
};

const DEFAULT_FEED_ITEM_LIST = {
    feedID: '',
    items: {}
};

const DEFAULT_STATE = {
    tab: DEFAULT_MAIN_TAB, // The current tab ID [ PLUGIN_LIST | FEED_EDITOR | FEED_LIST ]
    commands: [], // The list of loaded commands
    feeds: [], // The list of loaded feeds
    feedEditor: DEFAULT_EDITED_FEED, // Current state of the feed editing ,
    feedItemList: DEFAULT_FEED_ITEM_LIST
};

// ACTIONS
// SET_EDIT_FEED | SET_PLUGINS
export default (
    state = DEFAULT_STATE,
    { type, tab, commands, feed, feedID, feeds, itemFolding }
) => {
    switch (type) {
        case 'SET_EDITED_FEED':
            return Object.assign({}, state, {
                feedEditor: Object.assign({}, state.feedEditor, { data: feed })
            });
        case 'SET_COMMANDS':
            return Object.assign({}, state, { commands });
        case 'SET_TAB':
            return Object.assign({}, state, { tab });
        case 'SET_FEED_LIST':
            return Object.assign({}, state, { feeds });
        case 'SET_FEED_ITEM_LIST':
            return Object.assign({}, state, {
                feedItemList: Object.assign({}, state.feedItemList, { feedID })
            });
        case 'SET_FEED_EDITOR_TAB':
            return Object.assign({}, state, {
                feedEditor: Object.assign({}, state.feedEditor, { tab })
            });
        case 'LOAD_FEED_TO_EDITOR':
            const { feedEditor, feeds: currentFeeds } = state;
            const feedEditorCopy = Object.assign({}, feedEditor);
            const loadedFeed = currentFeeds.find(feed => feed.id === feedID);

            feedEditorCopy.feedID = feedID; // Set the edited feed to a registered one
            feedEditorCopy.data = loadedFeed;

            return Object.assign({}, state, { feedEditor: feedEditorCopy });
        case 'RESET_FEED_EDITOR':
            return Object.assign({}, state, {
                feedEditor: DEFAULT_EDITED_FEED
            });
        case 'TOGGLE_ITEM_FOLDING':
            const { itemID, folding } = itemFolding;
            const feedItemList = Object.assign({}, state.feedItemList);
            const { items } = feedItemList;
            items[itemID] = folding;
            return Object.assign({}, state, { feedItemList });
        default:
            return state;
    }
};
