import { createHandlers } from "./handlers";
import { createQueryHandlers } from "./queries";
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
    state = {
      ...state,
      ...newState,
    };

    listener.emit({ type: "STORE_UPDATED", data: api.getState() });
  };

  const dispatch = (
    event: FileItemEvents | StoreActions | AppEvents,
    data: any
  ) => {
    const handler = actionHandlers[event];

    if (appEvents.includes(event as AppEvents)) {
      listener.emit({
        type: event as AppEvents,
        data,
      });
    }

    if (handler) {
      handler(data);
    }
  };

  const query = (str: any, ...args: any) =>
    queryHandles[str] ? queryHandles[str](...args) : null;

  // handlers
  const actionHandlers = createHandlers({
    setState,
    getState,
    dispatch,
    query,
  });

  const queryHandles = createQueryHandlers({
    setState,
    getState,
    dispatch,
  });

  const api = {
    getState: () => ({
      ...state,
      items: state.items.map((i) => ({
        ...i,
        status: i.status.get(),
        progress: i.progress.get(),
        id: i.id.get(),
        name: i.file.get().name,
      })),
    }),
    dispatch,
    query,
  };

  return api;
};
