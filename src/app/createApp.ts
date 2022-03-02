import { FileItem, FileItemServer, FileMonkApp } from "../types";
import { createListener } from "./createListener";

import { createStore } from "./createStore";
import { queries } from "./queries";

export const createApp = (
  config: {
    name?: string;
    maxParallelUploads?: number;
  } = { maxParallelUploads: 1, name: "fileMonk" }
): FileMonkApp => {
  const listener = createListener();

  const store = createStore(listener, {
    maxParallelUploads: config.maxParallelUploads!,
  });

  const _getFileItems = () => store.query(queries.GET_IDLE_ITEMS);

  const addFiles = (
    payload: {
      file: File;
      server: FileItemServer;
    }[]
  ) => {
    payload.forEach((p) => {
      store.dispatch("CREATE_FILE_ITEM", p);
    });
  };

  const addFile = (file: File, server: FileItemServer) => {
    return addFiles([
      {
        file,
        server,
      },
    ]);
  };

  const _processFile = (item: FileItem) => {
    store.dispatch("REQUEST_PROCESS_FILE_ITEM", item);
  };

  const processFiles = () => {
    const items = _getFileItems();

    items.map(_processFile);
  };

  const api: FileMonkApp = {
    name: config.name!,
    addFile,
    getState: store.getState,
    subscribe: listener.subscribe,
    subscribeOnce: listener.subscribeOnce,
    processFiles,
  };

  return api;
};
