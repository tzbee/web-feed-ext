const LOADING_ICON_PATH = 'dist/img/loading.svg';
const DEFAULT_ICON_PATH = 'dist/img/up-arrow.png';
const NEW_FEEDS_ICON_PATH = 'dist/img/new_feeds.png';

const setIconByPath = path => chrome.browserAction.setIcon({ path });

export const setDefaultIcon = () => setIconByPath(DEFAULT_ICON_PATH);
export const setLoadingIcon = () => setIconByPath(LOADING_ICON_PATH);
export const setNewFeedsIcon = () => setIconByPath(NEW_FEEDS_ICON_PATH);
