import { FileItemEvents, FileItemStatus } from "./app/enum";

export type FileMonkApp = {
  name: string;
  addFile: (file: File, server: FileItemServer) => void;
  getState: () => any;
  subscribe: (event: AppEvents, cb: (data: any) => void) => void;
  subscribeOnce: (event: AppEvents, cb: (data: any) => void) => void;
  processFiles: () => void;
};

export type EventPayload<E, T> = {
  type: E;
  data?: T;
};

export interface MonkListener<E, T> {
  emit: (payload: EventPayload<E, T>) => void;
  subscribe: <T>(event: E, cb: T) => void;
  subscribeOnce: (event: E, ...args: any) => void;
  unsubscribe: (event: E, cb: any) => void;
}

export type FileItemServer = {
  uploadUrl: string;
  headers?: Object;
};

export type Getter<T> = { get: () => T };

export type FileItem = {
  id: Getter<string>;
  file: Getter<File>;
  server: Getter<FileItemServer>;
  abortController: Getter<AbortController>;
  status: Getter<FileItemStatus>;
  process: () => Promise<boolean>;
  requestProcessing: () => void;
  progress: Getter<number>;
} & Omit<MonkListener<FileItemEvents, any>, "emit">;

// Events
export type StoreActions =
  | "STORE_UPDATED"
  | "CREATE_FILE_ITEM"
  | "PROCESS_FILE_ITEMS"
  | "PROCESS_FILE_ITEM"
  | "REQUEST_PROCESS_FILE_ITEM";

export type AppEvents =
  | "DID_CREATE_ITEM"
  | "DID_REQUEST_ITEM_PROCESSING"
  | "DID_PROCESSING_FAILED"
  | "DID_PROCESSING_COMPLETE"
  | "DID_COMPLETE_ITEM_PROCESSING_ALL"
  | StoreActions;

// state
export type MonkStoreState = {
  items: FileItem[];
  processingQueue: string[];
  maxParallelUploads: number;
};

export type FileState = {
  id: string;
  file: File;
  server: FileItemServer;
  abortController: AbortController;
  status: FileItemStatus;
  progress: number;
};

// actions
export type StoreHandlers = {
  CREATE_FILE_ITEM: () => void;
  CREATE_FILE_ITEMS: () => void;
  PROCESS_ITEM: () => void;
};
