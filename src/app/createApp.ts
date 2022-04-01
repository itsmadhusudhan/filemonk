import {
  AddFileType,
  AppConfig,
  AppEvents,
  FileItem,
  FileMonkApp,
} from "../types";
import { createListener } from "./createListener";

import { createStore } from "./createStore";
import { queries } from "./queries";

/**
 * default app config
 */
const initialConfig: AppConfig = {
  name: "fileMonk",
  maxParallelUploads: 1,
  server: {
    uploadUrl: "/",
    requestHeaders: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
  },
};

/**
 *
 * @param {AppConfig} config
 * @returns {FileMonkApp}
 */
export const createApp = (config: AppConfig = initialConfig): FileMonkApp => {
  let listener = createListener<AppEvents, any>();

  let store = createStore(listener, {
    ...initialConfig,
    ...config,
  });

  const _getFileItems = () => store.query(queries.GET_IDLE_ITEMS);

  /**
   *
   * @param {AddFileType} payload
   *
   */
  const addFiles = (payload: AddFileType[]) => {
    payload.forEach((p) => {
      store.dispatch("CREATE_FILE_ITEM", p);
    });
  };

  const addFile = (payload: AddFileType) => addFiles([payload]);

  // file processing
  const _processFile = (item: FileItem) => {
    store.dispatch("REQUEST_PROCESS_FILE_ITEM", item);
  };

  const processFiles = () => {
    const items = _getFileItems();

    items.map(_processFile);
  };

  const clearApp = () => {
    // FIXME: need to abort any file operations
    // recreate the store and listeners
    listener = createListener<AppEvents, any>();

    store = createStore(listener, {
      ...initialConfig,
      ...config,
    });
  };

  const api: FileMonkApp = {
    name: config.name!,
    getState: store.getState,
    addFile,
    addFiles,
    processFiles,
    subscribe: listener.subscribe,
    subscribeOnce: listener.subscribeOnce,
    unsubscribe: listener.unsubscribe,
    clearApp,
  };

  return api;
};
