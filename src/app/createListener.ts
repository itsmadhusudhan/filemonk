import { EventPayload, MonkListener } from "../types";

export function createListener<E, T>(): MonkListener<E, T> {
  let listeners: { event: E; cb: any }[] = [];

  const unsubscribe = (event: E, cb: any) => {
    listeners = listeners.filter((listener) => {
      return !(listener.event === event && (listener.cb === cb || !cb));
    });
  };

  const emit = (payload: EventPayload<E, T>) => {
    listeners
      .filter((listener) => listener.event === payload.type)
      .map((listener) => listener.cb.bind(listener))
      .forEach((cb) =>
        cb({
          type: payload.type,
          data: payload.data,
        })
      );
  };

  const subscribe = <T>(event: E, cb: T) => {
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
  };

  return api;
}
