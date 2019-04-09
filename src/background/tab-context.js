/*
   Create a new {tabContext} function.
   All further calls of {tabContext} 
   will open a new tab in the same unique window as 
   the first one until the window of all tabs are closed.
   Effectively, only one window must be active at a any given time in a particular context.

   @params 
   url The url to open the first tab with. Open an empty tab if not specified.

   @return the created {tabContext}
*/

import { isString, isArray } from '../utils/utils';

function createNewTabContext() {
    var contextWindowID = null;

    const openSingleTab = url => {
        if (!url) return Promise.resolve();

        // If no context window was created yet,
        // Open a new window
        // It becomes the new context window
        if (contextWindowID === null) {
            return createTabInNewWindow(url).then(
                window => (contextWindowID = window.id)
            );
        } else {
            // If a new tab has been created in this context window
            // try to open a new tab in the context window
            return createTabInWindow(url, contextWindowID).catch(() => {
                // If no context window is open
                // Open a new window
                // It becomes the new context window
                return createTabInNewWindow(url).then(
                    window => (contextWindowID = window.id)
                );
            });
        }
    };

    const openMultipleTabs = urls => {
        // Check with user if too many tabs

        const nTabs = urls.length;
        var confirmed = true;

        if (nTabs > 10) {
            confirmed = confirm(
                `About to open ${nTabs} tabs, are you sure you want to proceed?`
            );
        }

        if (confirmed) {
            return urls.reduce((p, url) => {
                return p.then(() => openSingleTab(url));
            }, Promise.resolve());
        } else {
            return Promise.reject(new Error('Open tabs operation canceled'));
        }
    };

    return url => {
        if (isString(url)) {
            return openSingleTab(url);
        } else if (isArray(url)) {
            return openMultipleTabs(url);
        } else {
            throw new Error(`Type error: ${url} is not a String or Array`);
        }
    };
}

function createTabInNewWindow(url) {
    return new Promise(resolve => {
        chrome.windows.create(
            {
                url: url,
                focused: true,
                state: 'maximized'
            },
            resolve
        );
    });
}

function createTabInWindow(url, windowID) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create(
            {
                url: url,
                active: true,
                windowId: windowID
            },
            tab => {
                if (chrome.runtime.lastError) {
                    reject(new Error(`No window with id ${windowID}`));
                } else {
                    resolve(tab);
                }
            }
        );
    });
}

/*
    This tab context will be shared across all background scripts 
    All tabs created using this context will open in the same window.
    See createNewTabContext() for more details
*/

const openNewTab = createNewTabContext();

export default openNewTab;
