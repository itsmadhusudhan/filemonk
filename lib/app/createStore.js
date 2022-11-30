"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
var handlers_1 = require("./handlers");
var queries_1 = require("./queries");
var transformFileItem_1 = require("../utils/transformFileItem");
var _initialState = {
    items: [],
    processingQueue: [],
};
/**
 *
 * @param {MonkListener} listener
 * @param {StoreConfig} config
 * @returns
 */
var createStore = function (listener, config) {
    var state = __assign(__assign({}, _initialState), { appConfig: config });
    var appEvents = [
        "DID_CREATE_ITEM",
        "DID_REQUEST_ITEM_PROCESSING",
        "DID_PROCESSING_ITEM_COMPLETE",
        "DID_PROCESSING_ITEM_NOT_FOUND",
        "DID_COMPLETE_ALL_ITEM_PROCESSING",
    ];
    var getState = function () { return (__assign({}, state)); };
    var setState = function (newState) {
        // update only if the new state is not an empty object
        if (Object.keys(newState).length > 0)
            state = __assign(__assign({}, state), newState);
        listener.emit("STORE_UPDATED", _transformState(api.getState()));
    };
    var _transformState = function (state) {
        return __assign(__assign({}, state), { items: state.items.map(transformFileItem_1.transformFileItem) });
    };
    var dispatch = function (event, data) {
        var handler = actionHandlers[event];
        if (appEvents.includes(event)) {
            listener.emit(event, data);
        }
        if (handler) {
            handler(data);
        }
    };
    var clearStore = function () {
        // FIXME: need to abort any file operations
        // clear all items listeners
        state.items.forEach(function (i) {
            i.unsubscribeAll();
        });
        setState(_initialState);
    };
    var query = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return queryHandlers[str] ? queryHandlers[str].apply(queryHandlers, args) : null;
    };
    // handlers
    var actionHandlers = (0, handlers_1.createHandlers)({
        setState: setState,
        getState: getState,
        dispatch: dispatch,
        query: query,
    });
    var queryHandlers = (0, queries_1.createQueryHandlers)({
        setState: setState,
        getState: getState,
        dispatch: dispatch,
    });
    var api = {
        getState: function () { return (__assign({}, state)); },
        dispatch: dispatch,
        query: query,
        clearStore: clearStore,
    };
    return api;
};
exports.createStore = createStore;
//# sourceMappingURL=createStore.js.map