import { AxiosResponse } from "axios";

import { createItem } from "./createItem";

import {
  FileItemServer,
  MonkStoreState,
  StoreActions,
  AppEvents,
  InternalFileItem,
  FileItemEvents,
} from "../types";
import { queries } from "./queries";
import { transformFileItem } from "../utils/transformFileItem";

export type StoreProp = {
  getState: () => MonkStoreState;
  setState: (newState: Partial<MonkStoreState>) => void;
  dispatch: (
    event: FileItemEvents | StoreActions | AppEvents,
    data: any
  ) => void;
  query: (query: any, data?: any) => any;
};

// FIXME: return type
export const createHandlers = (store: StoreProp): any => {
  const createFileItem = (data: { file: File; server: FileItemServer }) => {
    const serverConfig = store.query(queries.GET_SERVER_CONFIG);

    const fileItem = createItem(data.file, {
      ...data.server,
      config: {
        ...serverConfig,
        ...data.server.config,
      },
    });

    fileItem.subscribe("ON_ITEM_UPDATED", () => {
      store.setState({});
    });

    store.dispatch("DID_CREATE_ITEM", transformFileItem(fileItem));

    fileItem.subscribe("ON_FILE_PROCESS_START", () => {
      store.dispatch("ON_FILE_PROCESS_START", transformFileItem(fileItem));
    });

    store.setState({
      items: [...store.getState().items, fileItem],
    });
  };

  const requestProcessFile = (item: InternalFileItem) => {
    if (item.status.get() === "IN_QUEUE") return;

    item.requestProcessing();

    store.dispatch("DID_REQUEST_ITEM_PROCESSING", {
      id: item.id.get(),
      status: item.status.get(),
    });

    store.dispatch("PROCESS_FILE_ITEM", { query: item });
  };

  const processFile = ({ query }: { query: string | InternalFileItem }) => {
    const item =
      typeof query === "string"
        ? store.getState().items.find((i) => i.id.get() === query)
        : query;

    if (!item) {
      store.dispatch("DID_PROCESSING_ITEM_FAILED", {
        message: "File not found",
        data: query,
      });

      return;
    }

    const maxParallelUploads = store.query(
      queries.GET_MAX_PARALLEL_UPLOADS_ITEMS
    );

    const currentUploads = store.query(
      queries.GET_ITEMS_BY_STATUS,
      "UPLOADING"
    );

    if (maxParallelUploads === currentUploads.length) {
      store.setState({
        processingQueue: [...store.getState().processingQueue, item.id.get()],
      });

      return;
    }

    // return if it's already uploading
    if (item.status.get() === "UPLOADING") return;

    const processNext = () => {
      const state = store.getState();

      const queueEntry = state.processingQueue[0];

      if (!queueEntry) return;

      store.setState({
        processingQueue: state.processingQueue.slice(1),
      });

      const itemReference = store
        .getState()
        .items.find((i) => i.id.get() === queueEntry);

      if (!itemReference) {
        processNext();
        return;
      }

      store.dispatch("PROCESS_FILE_ITEM", { query: itemReference });
    };

    // CHECK for all items complete processing
    // upload file here
    item.subscribeOnce("ON_FILE_PROCESS_COMPLETE", (r: any) => {
      store.dispatch("DID_PROCESSING_ITEM_COMPLETE", {
        item: transformFileItem(item),
        status: "SUCCESS",
        response: r.data as AxiosResponse,
      });

      processNext();

      const items = store.query(queries.GET_PROCESSED_ITEMS);

      if (items.length === store.getState().items.length) {
        store.dispatch("DID_COMPLETE_ALL_ITEM_PROCESSING", {});
      }
    });

    // when processing failed
    item.subscribeOnce("ON_FILE_PROCESS_FAILED", () => {
      store.dispatch("DID_PROCESSING_ITEM_COMPLETE", {
        item: transformFileItem(item),
        status: "FAILED",
      });

      processNext();

      const items = store.query(queries.GET_PROCESSED_ITEMS);

      if (items.length === store.getState().items.length) {
        store.dispatch("DID_COMPLETE_ALL_ITEM_PROCESSING", {});
      }
    });

    const serverConfig = store.query(queries.GET_SERVER_CONFIG);

    item.process(serverConfig);
  };

  return {
    CREATE_FILE_ITEM: createFileItem,
    REQUEST_PROCESS_FILE_ITEM: requestProcessFile,
    PROCESS_FILE_ITEM: processFile,
  };
};
