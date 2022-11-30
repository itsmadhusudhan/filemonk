export var queries = {
    GET_IDLE_ITEMS: "GET_IDLE_ITEMS",
    GET_MAX_PARALLEL_UPLOADS_ITEMS: "GET_MAX_PARALLEL_UPLOADS_ITEMS",
    GET_ITEMS_BY_STATUS: "GET_ITEMS_BY_STATUS",
    GET_PROCESSED_ITEMS: "GET_PROCESSED_ITEMS",
    GET_SERVER_CONFIG: "GET_SERVER_CONFIG",
};
export var createQueryHandlers = function (store) {
    var _a;
    return _a = {},
        _a[queries.GET_IDLE_ITEMS] = function () {
            return store
                .getState()
                .items.filter(function (item) { return item.status.get() === "IDLE"; });
        },
        _a[queries.GET_MAX_PARALLEL_UPLOADS_ITEMS] = function () {
            return store.getState().appConfig.maxParallelUploads;
        },
        _a[queries.GET_ITEMS_BY_STATUS] = function (status) {
            return store.getState().items.filter(function (item) {
                return item.status.get() === status;
            });
        },
        _a[queries.GET_PROCESSED_ITEMS] = function () {
            return store.getState().items.filter(function (item) {
                var status = item.status.get();
                return (status === "UPLOADED" || status === "FAILED" || status === "CANCELLED");
            });
        },
        _a[queries.GET_SERVER_CONFIG] = function () {
            return store.getState().appConfig.server;
        },
        _a;
};
//# sourceMappingURL=queries.js.map