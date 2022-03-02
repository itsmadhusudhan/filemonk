import { MonkStoreState, StoreActions, AppEvents } from "../types";
import { FileItemEvents, FileItemStatus } from "./enum";

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
};

export const createQueryHandlers = (store: StoreProp): any => {
  return {
    [queries.GET_IDLE_ITEMS]: () => {
      return store
        .getState()
        .items.filter((item) => item.status.get() === FileItemStatus.IDLE);
    },
    [queries.GET_MAX_PARALLEL_UPLOADS_ITEMS]: () => {
      // FIXME:
      return store.getState().maxParallelUploads;
    },
    [queries.GET_ITEMS_BY_STATUS]: (status: FileItemStatus) => {
      return store.getState().items.filter((item) => {
        return item.status.get() === status;
      });
    },
    [queries.GET_PROCESSED_ITEMS]: () => {
      return store.getState().items.filter((item) => {
        return (
          item.status.get() !== FileItemStatus.IDLE &&
          item.status.get() !== FileItemStatus.IN_QUEUE &&
          item.status.get() !== FileItemStatus.UPLOADING
        );
      });
    },
  };
};
