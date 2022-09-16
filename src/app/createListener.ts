import { MonkListener, SubscribeCallback } from "../types";

export function createListener<E, T extends object>(): MonkListener<E, T> {
  let listeners: { event: E; cb: SubscribeCallback<E, any> }[] = [];

  const unsubscribeAll = () => {
    listeners = [];
  };

  const unsubscribe = (event: E, cb: SubscribeCallback<E, any>) => {
    listeners = listeners.filter((listener) => {
      return !(listener.event === event && (listener.cb === cb || !cb));
    });
  };

  const emit = (event: E, data?: T) => {
    listeners
      .filter((listener) => listener.event === event)
      .map((listener) => listener.cb.bind(listener))
      .forEach((cb) =>
        cb({
          type: event,
          data: data,
        })
      );
  };

  const subscribe = <T>(event: E, cb: SubscribeCallback<E, T>) => {
    listeners.push({ event, cb });
  };

  const subscribeOnce = (event: E, cb: any) => {
    listeners.push({
      event,
      cb(...args: any) {
        unsubscribe(event, this.cb);
        cb(...args);
      },
    });
  };

  const api = {
    emit,
    subscribe,
    subscribeOnce,
    unsubscribe,
    unsubscribeAll,
  };

  return api;
}
