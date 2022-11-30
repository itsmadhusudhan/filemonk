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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { createItem } from "./createItem";
import { queries } from "./queries";
import { transformFileItem } from "../utils/transformFileItem";
// FIXME: return type
export var createHandlers = function (store) {
    var createFileItem = function (data) {
        var serverConfig = store.query(queries.GET_SERVER_CONFIG);
        var fileItem = createItem(data.file, __assign(__assign({}, data.server), { config: __assign(__assign({}, serverConfig), data.server.config) }), data.context);
        fileItem.subscribe("ON_ITEM_UPDATED", function () {
            store.setState({});
        });
        store.dispatch("DID_CREATE_ITEM", transformFileItem(fileItem));
        fileItem.subscribe("ON_FILE_PROCESS_START", function () {
            store.dispatch("ON_FILE_PROCESS_START", transformFileItem(fileItem));
        });
        store.setState({
            items: __spreadArray(__spreadArray([], store.getState().items, true), [fileItem], false),
        });
    };
    var requestProcessFile = function (item) {
        if (item.status.get() === "IN_QUEUE")
            return;
        item.requestProcessing();
        store.dispatch("DID_REQUEST_ITEM_PROCESSING", {
            id: item.id.get(),
            status: item.status.get(),
        });
        store.dispatch("PROCESS_FILE_ITEM", { query: item });
    };
    var processFile = function (_a) {
        var query = _a.query;
        var item = typeof query === "string"
            ? store.getState().items.find(function (i) { return i.id.get() === query; })
            : query;
        if (!item) {
            store.dispatch("DID_PROCESSING_ITEM_NOT_FOUND", {
                message: "File not found",
                data: query,
            });
            return;
        }
        var maxParallelUploads = store.query(queries.GET_MAX_PARALLEL_UPLOADS_ITEMS);
        var currentUploads = store.query(queries.GET_ITEMS_BY_STATUS, "UPLOADING");
        if (maxParallelUploads === currentUploads.length) {
            store.setState({
                processingQueue: __spreadArray(__spreadArray([], store.getState().processingQueue, true), [item.id.get()], false),
            });
            return;
        }
        // return if it's already uploading
        if (item.status.get() === "UPLOADING")
            return;
        var processNext = function () {
            var state = store.getState();
            var queueEntry = state.processingQueue[0];
            if (!queueEntry)
                return;
            store.setState({
                processingQueue: state.processingQueue.slice(1),
            });
            var itemReference = store
                .getState()
                .items.find(function (i) { return i.id.get() === queueEntry; });
            if (!itemReference) {
                processNext();
                return;
            }
            store.dispatch("PROCESS_FILE_ITEM", { query: itemReference });
        };
        // CHECK for all items complete processing
        // upload file here
        item.subscribeOnce("ON_FILE_PROCESS_COMPLETE", function (r) {
            store.dispatch("DID_PROCESSING_ITEM_COMPLETE", {
                item: transformFileItem(item),
                status: "SUCCESS",
                response: r.data,
            });
            processNext();
            var items = store.query(queries.GET_PROCESSED_ITEMS);
            if (items.length === store.getState().items.length) {
                store.dispatch("DID_COMPLETE_ALL_ITEM_PROCESSING", {});
            }
        });
        // when processing failed
        item.subscribeOnce("ON_FILE_PROCESS_FAILED", function () {
            store.dispatch("DID_PROCESSING_ITEM_COMPLETE", {
                item: transformFileItem(item),
                status: "FAILED",
            });
            processNext();
            var items = store.query(queries.GET_PROCESSED_ITEMS);
            if (items.length === store.getState().items.length) {
                store.dispatch("DID_COMPLETE_ALL_ITEM_PROCESSING", {});
            }
        });
        var serverConfig = store.query(queries.GET_SERVER_CONFIG);
        item.process(serverConfig);
    };
    return {
        CREATE_FILE_ITEM: createFileItem,
        REQUEST_PROCESS_FILE_ITEM: requestProcessFile,
        PROCESS_FILE_ITEM: processFile,
    };
};
//# sourceMappingURL=handlers.js.map