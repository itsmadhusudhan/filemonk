import { AxiosRequestHeaders } from "axios";

// state
export type MonkStoreState = {
  items: InternalFileItem[];
  processingQueue: string[];
  appConfig: AppConfig;
};

export type AppState = Omit<MonkStoreState, "items"> & {
  items: FileItem[];
};

// file monk app
export type FileMonkApp = {
  name: string;
  getState: () => any;
  addFile: (payload: AddFileType) => void;
  addFiles: (payload: AddFileType[]) => void;
  subscribe: (event: AppEvents, cb: (data: any) => void) => void;
  subscribeOnce: (event: AppEvents, cb: (data: any) => void) => void;
  processFiles: () => void;
  unsubscribe: (event: AppEvents, cb: (data: any) => void) => void;
  resetAppStore: () => void;
  version: string;
};

export type AppConfig = {
  name?: string;
  maxParallelUploads?: number;
  server: AppServerConfig;
};

export type AppServerConfig = {
  uploadUrl: string;
  requestHeaders?: AxiosRequestHeaders;
  method?: "POST" | "PATCH";
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
};

// Method types
export type FileItemServer = {
  config: AppServerConfig;
  data: { [id: string]: any };
};

export type AddFileType = {
  file: File;
  server: Omit<FileItemServer, "config"> & {
    config?: AppServerConfig;
  };
  context?: FileItem["context"];
};

export type EventPayload<E, T> = {
  type: E;
  data?: T;
};

export type SubscribeCallback<E, D> = (payload: { type: E; data: D }) => void;

export interface MonkListener<E, T extends object> {
  emit: (event: E, data?: T) => void;
  subscribe: <D>(event: E, cb: SubscribeCallback<E, D>) => void;
  subscribeOnce: (event: E, ...args: any) => void;
  unsubscribe: (event: E, cb: any) => void;
  unsubscribeAll: () => void;
}

export type Getter<T> = { get: () => T };

export type InternalFileItem = {
  id: Getter<string>;
  file: Getter<File>;
  server: Getter<FileItemServer>;
  abortController: Getter<AbortController>;
  status: Getter<FileItemStatus>;
  process: (serverConfig: AppConfig["server"]) => Promise<void>;
  requestProcessing: () => void;
  progress: Getter<number>;
  context: { [key: string]: any };
} & Omit<MonkListener<FileItemEvents, any>, "emit">;

export type FileItem = {
  id: string;
  file: File;
  server: FileItemServer;
  status: FileItemStatus;
  name: string;
  progress: number;
  context: { [key: string]: any };
};

export type FileState = {
  id: string;
  file: File;
  server: FileItemServer;
  abortController: AbortController;
  status: FileItemStatus;
  progress: number;
  context: FileItem["context"];
};

export type FileItemStatus =
  | "IDLE"
  | "IN_QUEUE"
  | "UPLOADING"
  | "UPLOADED"
  | "FAILED"
  | "CANCELLED";

// events
export type FileItemEvents =
  | "ON_ITEM_UPDATED"
  | "ON_FILE_PROCESS_START"
  | "ON_FILE_PROCESS_PROGRESS"
  | "ON_FILE_PROCESS_COMPLETE"
  | "ON_FILE_PROCESS_CANCELLED"
  | "ON_FILE_PROCESS_FAILED";

export type AppEvents =
  | "DID_CREATE_ITEM"
  | "DID_REQUEST_ITEM_PROCESSING"
  | "DID_PROCESSING_ITEM_NOT_FOUND"
  | "DID_PROCESSING_ITEM_COMPLETE"
  | "DID_COMPLETE_ALL_ITEM_PROCESSING"
  | "STORE_UPDATED";

// actions
export type StoreActions =
  | "CREATE_FILE_ITEM"
  | "PROCESS_FILE_ITEMS"
  | "PROCESS_FILE_ITEM"
  | "REQUEST_PROCESS_FILE_ITEM";

// action handlers
export type StoreHandlers = {
  CREATE_FILE_ITEM: () => void;
  CREATE_FILE_ITEMS: () => void;
  PROCESS_ITEM: () => void;
};
