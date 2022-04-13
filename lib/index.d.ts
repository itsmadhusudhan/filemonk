import { AxiosRequestHeaders } from 'axios';

declare type MonkStoreState = {
    items: InternalFileItem[];
    processingQueue: string[];
    appConfig: AppConfig;
};
declare type AppState = Omit<MonkStoreState, "items"> & {
    items: FileItem[];
};
declare type FileMonkApp = {
    name: string;
    getState: () => any;
    addFile: (payload: AddFileType) => void;
    addFiles: (payload: AddFileType[]) => void;
    subscribe: (event: AppEvents, cb: (data: any) => void) => void;
    subscribeOnce: (event: AppEvents, cb: (data: any) => void) => void;
    processFiles: () => void;
    unsubscribe: (event: AppEvents, cb: (data: any) => void) => void;
    resetAppStore: () => void;
};
declare type AppConfig = {
    name?: string;
    maxParallelUploads?: number;
    server: AppServerConfig;
};
declare type AppServerConfig = {
    uploadUrl: string;
    requestHeaders?: AxiosRequestHeaders;
    method?: "POST" | "PATCH";
};
declare type FileItemServer = {
    config: AppServerConfig;
    data: {
        [id: string]: any;
    };
};
declare type AddFileType = {
    file: File;
    server: Omit<FileItemServer, "config"> & {
        config?: AppServerConfig;
    };
    context?: FileItem["context"];
};
declare type EventPayload<E, T> = {
    type: E;
    data?: T;
};
interface MonkListener<E, T extends object> {
    emit: (event: E, data?: T) => void;
    subscribe: <T>(event: E, cb: T) => void;
    subscribeOnce: (event: E, ...args: any) => void;
    unsubscribe: (event: E, cb: any) => void;
    unsubscribeAll: () => void;
}
declare type Getter<T> = {
    get: () => T;
};
declare type InternalFileItem = {
    id: Getter<string>;
    file: Getter<File>;
    server: Getter<FileItemServer>;
    abortController: Getter<AbortController>;
    status: Getter<FileItemStatus>;
    process: (serverConfig: AppConfig["server"]) => Promise<boolean>;
    requestProcessing: () => void;
    progress: Getter<number>;
    context: {
        [key: string]: any;
    };
} & Omit<MonkListener<FileItemEvents, any>, "emit">;
declare type FileItem = {
    id: string;
    file: File;
    server: FileItemServer;
    status: FileItemStatus;
    name: string;
    progress: number;
    context: {
        [key: string]: any;
    };
};
declare type FileState = {
    id: string;
    file: File;
    server: FileItemServer;
    abortController: AbortController;
    status: FileItemStatus;
    progress: number;
    context: FileItem["context"];
};
declare type FileItemStatus = "IDLE" | "IN_QUEUE" | "UPLOADING" | "UPLOADED" | "FAILED" | "CANCELLED";
declare type FileItemEvents = "ON_ITEM_UPDATED" | "ON_FILE_PROCESS_START" | "ON_FILE_PROCESS_PROGRESS" | "ON_FILE_PROCESS_COMPLETE" | "ON_FILE_PROCESS_CANCELLED" | "ON_FILE_PROCESS_FAILED";
declare type AppEvents = "DID_CREATE_ITEM" | "DID_REQUEST_ITEM_PROCESSING" | "DID_PROCESSING_ITEM_FAILED" | "DID_PROCESSING_ITEM_COMPLETE" | "DID_COMPLETE_ALL_ITEM_PROCESSING" | "STORE_UPDATED";
declare type StoreActions = "CREATE_FILE_ITEM" | "PROCESS_FILE_ITEMS" | "PROCESS_FILE_ITEM" | "REQUEST_PROCESS_FILE_ITEM";
declare type StoreHandlers = {
    CREATE_FILE_ITEM: () => void;
    CREATE_FILE_ITEMS: () => void;
    PROCESS_ITEM: () => void;
};

/**
 *
 * @param {AppConfig} config
 * @returns {FileMonkApp}
 */
declare const createApp: (config?: AppConfig) => FileMonkApp;

export { AddFileType, AppConfig, AppEvents, AppServerConfig, AppState, EventPayload, FileItem, FileItemEvents, FileItemServer, FileItemStatus, FileMonkApp, FileState, Getter, InternalFileItem, MonkListener, MonkStoreState, StoreActions, StoreHandlers, createApp };
