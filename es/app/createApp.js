var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { transformFileItem } from "../utils/transformFileItem";
import { createListener } from "./createListener";
import { createStore } from "./createStore";
import { queries } from "./queries";
/**
 * default app config
 */
var initialConfig = {
    name: "fileMonk",
    maxParallelUploads: 1,
    server: {
        uploadUrl: "/",
        requestHeaders: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
    },
};
/**
 *
 * @param {AppConfig} config
 * @returns {FileMonkApp}
 */
export var createApp = function (config) {
    if (config === void 0) { config = initialConfig; }
    var listener = createListener();
    var appConfig = __assign(__assign(__assign({}, initialConfig), config), { server: __assign(__assign({}, initialConfig.server), config.server) });
    var store = createStore(listener, appConfig);
    var _getFileItems = function () { return store.query(queries.GET_IDLE_ITEMS); };
    /**
     *
     * @param {AddFileType} payload
     *
     */
    var addFiles = function (payload) {
        payload.forEach(store.dispatch.bind(null, "CREATE_FILE_ITEM"));
    };
    var addFile = function (payload) { return addFiles([payload]); };
    // file processing
    var _processFile = function (item) {
        store.dispatch("REQUEST_PROCESS_FILE_ITEM", item);
    };
    var processFiles = function () {
        var items = _getFileItems();
        items.map(_processFile);
    };
    var resetAppStore = function () {
        store.clearStore();
    };
    var api = {
        name: appConfig.name,
        getState: function () {
            var state = store.getState();
            return __assign(__assign({}, state), { items: state.items.map(transformFileItem) });
        },
        addFile: addFile,
        addFiles: addFiles,
        processFiles: processFiles,
        subscribe: listener.subscribe,
        subscribeOnce: listener.subscribeOnce,
        unsubscribe: listener.unsubscribe,
        resetAppStore: resetAppStore,
    };
    return api;
};
//# sourceMappingURL=createApp.js.map