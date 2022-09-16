import {
  AddFileType,
  AppConfig,
  AppEvents,
  FileMonkApp,
  InternalFileItem,
} from "../types";
import { transformFileItem } from "../utils/transformFileItem";
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
export const createApp = (
  config: Partial<AppConfig> = initialConfig
): FileMonkApp => {
  let listener = createListener<AppEvents, any>();

  const appConfig: AppConfig = {
    ...initialConfig,
    ...config,
    server: {
      ...initialConfig.server,
      ...config.server,
    },
  };

  let store = createStore(listener, appConfig);

  const _getFileItems = () => store.query(queries.GET_IDLE_ITEMS);

  /**
   *
   * @param {AddFileType} payload
   *
   */
  const addFiles = (payload: AddFileType[]) => {
    payload.forEach(store.dispatch.bind(null, "CREATE_FILE_ITEM"));
  };

  const addFile = (payload: AddFileType) => addFiles([payload]);

  // file processing
  const _processFile = (item: InternalFileItem) => {
    store.dispatch("REQUEST_PROCESS_FILE_ITEM", item);
  };

  const processFiles = () => {
    const items = _getFileItems();

    items.map(_processFile);
  };

  const resetAppStore = () => {
    store.clearStore();
  };

  const api: FileMonkApp = {
    name: appConfig.name!,
    getState: () => {
      const state = store.getState();
      return {
        ...state,
        items: state.items.map(transformFileItem),
      };
    },
    addFile,
    addFiles,
    processFiles,
    subscribe: listener.subscribe,
    subscribeOnce: listener.subscribeOnce,
    unsubscribe: listener.unsubscribe,
    resetAppStore,
  };

  return api;
};
