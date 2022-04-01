import {
  MonkStoreState,
  StoreActions,
  AppEvents,
  FileItemStatus,
  FileItemEvents,
} from "../types";

export type StoreProp = {
  getState: () => MonkStoreState;
  setState: (newState: Partial<MonkStoreState>) => void;
  dispatch: (
    event: FileItemEvents | StoreActions | AppEvents,
    data: any
  ) => void;
};

export const queries = {
  GET_IDLE_ITEMS: "GET_IDLE_ITEMS",
  GET_MAX_PARALLEL_UPLOADS_ITEMS: "GET_MAX_PARALLEL_UPLOADS_ITEMS",
  GET_ITEMS_BY_STATUS: "GET_ITEMS_BY_STATUS",
  GET_PROCESSED_ITEMS: "GET_PROCESSED_ITEMS",
  GET_SERVER_CONFIG: "GET_SERVER_CONFIG",
};

export const createQueryHandlers = (store: StoreProp): any => {
  return {
    [queries.GET_IDLE_ITEMS]: () => {
      return store
        .getState()
        .items.filter((item) => item.status.get() === "IDLE");
    },
    [queries.GET_MAX_PARALLEL_UPLOADS_ITEMS]: () => {
      return store.getState().appConfig.maxParallelUploads;
    },
    [queries.GET_ITEMS_BY_STATUS]: (status: FileItemStatus) => {
      return store.getState().items.filter((item) => {
        return item.status.get() === status;
      });
    },
    [queries.GET_PROCESSED_ITEMS]: () => {
      return store.getState().items.filter((item) => {
        const status = item.status.get();

        return (
          status === "UPLOADED" || status === "FAILED" || status === "CANCELLED"
        );
      });
    },
    [queries.GET_SERVER_CONFIG]: () => {
      return store.getState().appConfig.server;
    },
  };
};
