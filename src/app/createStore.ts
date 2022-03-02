import {
  AppEvents,
  FileItemEvents,
  MonkListener,
  MonkStoreState,
  StoreActions,
} from "../types";
import { createHandlers } from "./handlers";
import { createQueryHandlers } from "./queries";

export const createStore = (
  listener: MonkListener<any, any>,
  config: { maxParallelUploads: number }
) => {
  let state: MonkStoreState = {
    items: [],
    processingQueue: [],
    maxParallelUploads: config.maxParallelUploads,
  };
  const appActions = [
    "DID_CREATE_ITEM",
    "DID_REQUEST_ITEM_PROCESSING",
    "DID_PROCESSING_COMPLETE",
    "DID_COMPLETE_ITEM_PROCESSING_ALL",
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

    if (appActions.includes(event))
      listener.emit({
        type: event as StoreActions,
        data,
      });

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
