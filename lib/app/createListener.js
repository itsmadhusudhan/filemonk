"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListener = void 0;
function createListener() {
    var listeners = [];
    var unsubscribeAll = function () {
        listeners = [];
    };
    var unsubscribe = function (event, cb) {
        listeners = listeners.filter(function (listener) {
            return !(listener.event === event && (listener.cb === cb || !cb));
        });
    };
    var emit = function (event, data) {
        listeners
            .filter(function (listener) { return listener.event === event; })
            .map(function (listener) { return listener.cb.bind(listener); })
            .forEach(function (cb) {
            return cb({
                type: event,
                data: data,
            });
        });
    };
    var subscribe = function (event, cb) {
        listeners.push({ event: event, cb: cb });
    };
    var subscribeOnce = function (event, cb) {
        listeners.push({
            event: event,
            cb: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                unsubscribe(event, this.cb);
                cb.apply(void 0, args);
            },
        });
    };
    var api = {
        emit: emit,
        subscribe: subscribe,
        subscribeOnce: subscribeOnce,
        unsubscribe: unsubscribe,
        unsubscribeAll: unsubscribeAll,
    };
    return api;
}
exports.createListener = createListener;
//# sourceMappingURL=createListener.js.map