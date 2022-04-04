import { createHandlers } from "./handlers";
import { createQueryHandlers } from "./queries";

import { transformFileItem } from "../utils/transformFileItem";

import {
  AppEvents,
  MonkListener,
  MonkStoreState,
  StoreActions,
  FileItemEvents,
  AppConfig,
} from "../types";

/**
 *
 * @param {MonkListener} listener
 * @param {StoreConfig} config
 * @returns
 */
export const createStore = (
  listener: MonkListener<AppEvents, any>,
  config: AppConfig
) => {
  let state: MonkStoreState = {
    items: [],
    processingQueue: [],
    appConfig: config,
  };

  const appEvents: AppEvents[] = [
    "DID_CREATE_ITEM",
    "DID_REQUEST_ITEM_PROCESSING",
    "DID_PROCESSING_ITEM_COMPLETE",
    "DID_PROCESSING_ITEM_FAILED",
    "DID_COMPLETE_ALL_ITEM_PROCESSING",
  ];

  const getState = () => ({ ...state });

  const setState = (newState: Partial<MonkStoreState>) => {
    // update only if the new state is not an empty object
    if (Object.keys(newState).length > 0)
      state = {
        ...state,
        ...newState,
      };

    listener.emit("STORE_UPDATED", api.getState());
  };

  const dispatch = (
    event: FileItemEvents | StoreActions | AppEvents,
    data: any
  ) => {
    const handler = actionHandlers[event];

    if (appEvents.includes(event as AppEvents)) {
      listener.emit(event as AppEvents, data);
    }

    if (handler) {
      handler(data);
    }
  };

  const query = (str: any, ...args: any) =>
    queryHandlers[str] ? queryHandlers[str](...args) : null;

  // handlers
  const actionHandlers = createHandlers({
    setState,
    getState,
    dispatch,
    query,
  });

  const queryHandlers = createQueryHandlers({
    setState,
    getState,
    dispatch,
  });

  const api = {
    getState: () => ({
      ...state,
    }),
    dispatch,
    query,
  };

  return api;
};
