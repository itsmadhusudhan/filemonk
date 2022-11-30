"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryHandlers = exports.queries = void 0;
exports.queries = {
    GET_IDLE_ITEMS: "GET_IDLE_ITEMS",
    GET_MAX_PARALLEL_UPLOADS_ITEMS: "GET_MAX_PARALLEL_UPLOADS_ITEMS",
    GET_ITEMS_BY_STATUS: "GET_ITEMS_BY_STATUS",
    GET_PROCESSED_ITEMS: "GET_PROCESSED_ITEMS",
    GET_SERVER_CONFIG: "GET_SERVER_CONFIG",
};
var createQueryHandlers = function (store) {
    var _a;
    return _a = {},
        _a[exports.queries.GET_IDLE_ITEMS] = function () {
            return store
                .getState()
                .items.filter(function (item) { return item.status.get() === "IDLE"; });
        },
        _a[exports.queries.GET_MAX_PARALLEL_UPLOADS_ITEMS] = function () {
            return store.getState().appConfig.maxParallelUploads;
        },
        _a[exports.queries.GET_ITEMS_BY_STATUS] = function (status) {
            return store.getState().items.filter(function (item) {
                return item.status.get() === status;
            });
        },
        _a[exports.queries.GET_PROCESSED_ITEMS] = function () {
            return store.getState().items.filter(function (item) {
                var status = item.status.get();
                return (status === "UPLOADED" || status === "FAILED" || status === "CANCELLED");
            });
        },
        _a[exports.queries.GET_SERVER_CONFIG] = function () {
            return store.getState().appConfig.server;
        },
        _a;
};
exports.createQueryHandlers = createQueryHandlers;
//# sourceMappingURL=queries.js.map