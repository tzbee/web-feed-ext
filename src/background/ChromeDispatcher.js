/*
    CHROME DISPATCHER
    Wrapper around chrome messaging API
*/

import uuid from "uuid";
const generateID = () => uuid();

const HASH_PROP_KEY = "DISPATCHER_HASH";

const isChromeMessagingAvailable = () => {
    return (
        chrome &&
        chrome.runtime &&
        chrome.runtime.onMessage &&
        chrome.runtime.onMessage.addListener
    );
};

export default class ChromeDispatcher {
    constructor(chrome, port) {
        if (!isChromeMessagingAvailable()) {
            throw new Error("Cannot access chrome messaging");
        }
        this.port = port;
    }

    /*
        Listens to messages coming from the popup and content scripts
    */
    on(targetCommand, handler) {
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                const { command, ...options } = request;
                if (command === targetCommand) {
                    handler(options, sendResponse);
                }
                return true;
            }
        );
    }

    getHashPropKey() {
        return HASH_PROP_KEY;
    }

    /*
        Listens to messages coming from the native app
    */
    onNativeMessage(command, handler) {
        if (!this.port) return;
        this.port.onMessage.addListener(message => {
            if (message.command === command) {
                handler(message);
            }
        });
    }

    /*
        Broadcasts a message to the popup 
    */
    sendMessage(command, options = {}, responseCB) {
        options = this._extendOptions(options);
        chrome.runtime.sendMessage(
            Object.assign(options, { command: command }),
            responseCB
        );
    }

    /*
        Sends a message to the native app through the provided port 
    */
    sendMessageToNative(command, options = {}) {
        if (!this.port) return;
        options = this._extendOptions(options);
        this.port.postMessage(Object.assign(options, { command: command }));

        // Return hash to identify this request
        // todo better?
        return options[HASH_PROP_KEY];
    }

    // Add necessary properties to the sent object(e.g id hash)
    _extendOptions(options) {
        // Create a unique id hash
        const hash = generateID();

        options[HASH_PROP_KEY] = hash;

        return options;
    }

    /*
        Forward a single event (Same command and options) to the native app
    */
    _forwardToNativeSingle(command) {
        this.on(command, options => this.sendMessageToNative(command, options));
    }

    /*
        Forward an event or a list of events (Same command and options) to the native app

        @params 
            command {String} or {Array} of Command{String}
    */
    forwardToNative(command) {
        if (typeof command === "string") {
            this._forwardToNativeSingle(command);
        } else if (command.constructor.name === "Array") {
            command.forEach(this._forwardToNativeSingle.bind(this));
        } else {
            throw new Error(`Wrong command argument ${command}`);
        }
    }
}
