export var transformFileItem = function (item) {
    var file = item.file, id = item.id, status = item.status, progress = item.progress, server = item.server, _a = item.context, context = _a === void 0 ? {} : _a;
    return {
        file: file.get(),
        id: id.get(),
        name: file.get().name,
        server: server.get(),
        status: status.get(),
        progress: progress.get(),
        context: context,
    };
};
//# sourceMappingURL=transformFileItem.js.map