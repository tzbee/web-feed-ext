export const setTab = tab => ({ type: 'SET_TAB', tab });
export const setFeedEditorTab = tab => ({ type: 'SET_FEED_EDITOR_TAB', tab });
export const setEditedFeed = feed => ({ type: 'SET_EDITED_FEED', feed });
export const setCommands = commands => ({ type: 'SET_COMMANDS', commands });
export const setFeedList = feeds => ({ type: 'SET_FEED_LIST', feeds });
export const resetFeedEditor = () => ({ type: 'RESET_FEED_EDITOR' });
export const loadFeedToEditor = feedID => ({
	type: 'LOAD_FEED_TO_EDITOR',
	feedID
});
export const setFeedItemList = feedID => ({
	type: 'SET_FEED_ITEM_LIST',
	feedID
});
export const loadCommands = commands => dispatch => {
	dispatch(setCommands(commands));
	dispatch(updateFeedEditor());
};

const updateFeedEditor = feed => ({ type: 'UPDATE_FEED_EDITOR', feed });

export const createNewFeed = () => dispatch => {
	dispatch(resetFeedEditor());
	dispatch(setTab('FEED_EDITOR'));
};

export const toggleItemFolding = (itemID, folding) => ({
	type: 'TOGGLE_ITEM_FOLDING',
	itemFolding: { itemID, folding }
});

/*
	Filter actions
*/

const setFilterInput = filterValue => ({
	type: 'SET_FILTER_INPUT',
	filterValue
});

const applyFilter = filterValue => ({
	type: 'APPLY_FILTER',
	filterValue
});

export const setFilter = filterValue => dispatch => {
	dispatch(setFilterInput(filterValue));
	dispatch(applyFilter(filterValue));
};
