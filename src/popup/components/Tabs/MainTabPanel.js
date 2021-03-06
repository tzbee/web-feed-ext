import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {
    setTab,
    setFeedEditorTab,
    createFeed,
    loadFeedToEditor,
    setEditedFeed,
    createNewFeed,
    setFeedItemList,
    toggleItemFolding,
    setFilter
} from '../../actions';

import {
    saveFeed,
    deleteFeed,
    followFeed,
    unfollowFeed,
    markFeedAsRead,
    markItemAsRead,
    openNewTab,
    banItemIDFromFeed
} from '../../actions/command-actions';

import TabPanel from './TabPanel';
import FeedList from '../Feeds/Feeds';
import FeedEditorTabPanel from '../FeedEditor/FeedEditor';
import FeedItemsTab from '../FeedItems/FeedItemsTab';

const { connect } = ReactRedux;

const CLASS_MAP = {
    tabNavItem: 'MainTabPanel-tabNavItem'
};

const MainTabPanel = ({ ...props }) => {
    return (
        <TabPanel classMap={CLASS_MAP} {...props}>
            <FeedList />
            <FeedEditorTabPanel />
            <FeedItemsTab />
        </TabPanel>
    );
};

const createFeedEditorProps = (feedEditor, commands) => {
    const { data, tab } = feedEditor;

    // Get the available commands
    const commandIDs = (commands && commands.map(command => command.id)) || [];

    // Set a default command id if none is specified
    const commandID =
        data.commandID || (commands && commands.length > 0 && commandIDs[0]);

    // If the current feed command is not available in the registered commands,
    // add it to the list anyways, even though it probably won't run (for now)
    if (commandID && commandIDs.indexOf(commandID) === -1) {
        commandIDs.push(commandID);
    }

    // The current command in the feed editor
    const command = commands.find(
        registeredCommand => registeredCommand.id === commandID
    );

    const feedArgs = data.args || [];

    const args =
        command &&
        command.args.map(arg => {
            const { key } = arg;
            const feedArg = feedArgs.find(
                ({ key: feedArgKey }) => key === feedArgKey
            );
            return Object.assign({}, arg, {
                key,
                value: (feedArg && feedArg.value) || ''
            });
        });

    const dataFields = (command && command.returnFields) || [];

    return {
        feed: Object.assign({}, data, { args, dataFields, commandID }),
        commandIDs,
        selectedTabID: tab
    };
};

const mapStateToProps = ({
    tab,
    commands,
    feeds,
    feedEditor,
    feedItemList
}) => {
    const {
        feedID,
        items: itemFolding,
        appliedFilter,
        filterInput
    } = feedItemList;
    const feed = feeds.find(feed => feed.id === feedID);
    const filterStr = appliedFilter.toLowerCase();

    // Decide if an item should be displaied base on the filter string
    const isItemFilteredIn = item => {
        const itemTitle = item.title || '';
        const itemID = item.id || '';

        return (
            !filterStr ||
            itemTitle.indexOf(filterStr) !== -1 ||
            itemID.indexOf(filterStr) !== -1
        );
    };

    const items =
        (feed &&
            feed.items &&
            feed.items.map(item => {
                // Set item display prop
                item.isActive = isItemFilteredIn(item);

                // Set item folding prop
                item.isFolded =
                    item.id in itemFolding ? itemFolding[item.id] : true;

                return item;
            })) ||
        [];

    const tabs = [
        {
            id: 'FEED_LIST',
            title: 'My Feeds',
            data: { feeds }
        },
        {
            id: 'FEED_EDITOR',
            title: 'Create New Feed',
            data: createFeedEditorProps(feedEditor, commands, feeds)
        },
        {
            id: 'FEED_ITEM_LIST',
            // No title props means the tab is not navigable through the menu
            data: {
                feedID,
                items,
                filterValue: filterInput
            }
        }
    ];

    const selectedTabID = tab;
    return { tabs, selectedTabID };
};

const mapDispatchToProps = dispatch => ({
    selectTabID: tabID => {
        dispatch(setTab(tabID));
        if (tabID === 'FEED_EDITOR') {
            dispatch(createNewFeed());
        }
    },
    selectFeedEditorTabID: tabID => dispatch(setFeedEditorTab(tabID)),
    createFeed: feed => dispatch(createFeed(feed)),
    loadFeedToEditor: id => {
        dispatch(loadFeedToEditor(id));
        dispatch(setTab('FEED_EDITOR'));
        dispatch(setFeedEditorTab('GENERAL'));
    },
    setEditedFeed: feed => dispatch(setEditedFeed(feed)),
    deleteFeed: id => dispatch(deleteFeed(id)),
    unfollowFeed: id => dispatch(unfollowFeed(id)),
    createNewFeed: () => dispatch(createNewFeed()),
    saveFeed: feed => dispatch(saveFeed(feed)),
    viewItems: id => {
        dispatch(setFeedItemList(id));
        dispatch(setTab('FEED_ITEM_LIST'));
    },
    followFeed: id => dispatch(followFeed(id)),
    markFeedAsRead: id => dispatch(markFeedAsRead(id)),
    markItemAsRead: (feedID, itemID) =>
        dispatch(markItemAsRead(feedID, itemID)),
    openNewTab: url => dispatch(openNewTab(url)),
    banItemIDFromFeed: (itemID, feedID) =>
        dispatch(banItemIDFromFeed(itemID, feedID)),
    toggleItemFolding: (itemID, folding) =>
        dispatch(toggleItemFolding(itemID, folding)),
    filterItems: filterValue => dispatch(setFilter(filterValue))
});

const mergeProps = (propsFromState, propsFromDispatch) => {
    const {
        selectFeedEditorTabID,
        loadFeedToEditor,
        setEditedFeed,
        deleteFeed,
        createNewFeed,
        saveFeed,
        viewItems,
        followFeed,
        markFeedAsRead,
        markItemAsRead,
        openNewTab,
        unfollowFeed,
        banItemIDFromFeed,
        toggleItemFolding,
        filterItems
    } = propsFromDispatch;

    const { tabs } = propsFromState;

    const feedEditorTab = tabs.find(tab => tab.id === 'FEED_EDITOR');
    feedEditorTab.data.selectTabID = selectFeedEditorTabID;
    feedEditorTab.data.saveFeed = saveFeed;
    feedEditorTab.data.setEditedFeed = setEditedFeed;

    const feedListTab = tabs.find(tab => tab.id === 'FEED_LIST');
    feedListTab.data.editFeed = loadFeedToEditor;
    feedListTab.data.deleteFeed = deleteFeed;
    feedListTab.data.createNewFeed = createNewFeed;
    feedListTab.data.viewItems = viewItems;
    feedListTab.data.followFeed = followFeed;
    feedListTab.data.unfollowFeed = unfollowFeed;
    feedListTab.data.markFeedAsRead = markFeedAsRead;
    feedListTab.data.openNewTab = openNewTab;

    const feedItemListTab = tabs.find(tab => tab.id === 'FEED_ITEM_LIST');
    feedItemListTab.data.markItemAsRead = markItemAsRead;
    feedItemListTab.data.openNewTab = openNewTab;
    feedItemListTab.data.banItemIDFromFeed = banItemIDFromFeed;
    feedItemListTab.data.toggleItemFolding = toggleItemFolding;
    feedItemListTab.data.onFilterChange = filterItems;

    return { ...propsFromState, ...propsFromDispatch };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(MainTabPanel);
