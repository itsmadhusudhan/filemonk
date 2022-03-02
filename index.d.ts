declare enum FileItemStatus {
    IDLE = "IDLE",
    IN_QUEUE = "IN_QUEUE",
    UPLOADING = "UPLOADING",
    UPLOADED = "UPLOADED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
declare enum FileItemEvents {
    ON_ITEM_UPDATED = "ON_ITEM_UPDATED",
    ON_FILE_PROCESS_START = "ON_FILE_PROCESS_START",
    ON_FILE_PROCESS_PROGRESS = "ON_FILE_PROCESS_PROGRESS",
    ON_FILE_PROCESS_COMPLETE = "ON_FILE_PROCESS_COMPLETE",
    ON_FILE_PROCESS_CANCELLED = "ON_FILE_PROCESS_CANCELLED",
    ON_FILE_PROCESS_FAILED = "ON_FILE_PROCESS_FAILED"
}

declare type FileMonkApp = {
    name: string;
    addFile: (file: File, server: FileItemServer) => void;
    getState: () => any;
    subscribe: (event: AppEvents, cb: (data: any) => void) => void;
    subscribeOnce: (event: AppEvents, cb: (data: any) => void) => void;
    processFiles: () => void;
};
declare type EventPayload<E, T> = {
    type: E;
    data?: T;
};
interface MonkListener<E, T> {
    emit: (payload: EventPayload<E, T>) => void;
    subscribe: <T>(event: E, cb: T) => void;
    subscribeOnce: (event: E, ...args: any) => void;
    unsubscribe: (event: E, cb: any) => void;
}
declare type FileItemServer = {
    uploadUrl: string;
    headers?: Object;
};
declare type Getter<T> = {
    get: () => T;
};
declare type FileItem = {
    id: Getter<string>;
    file: Getter<File>;
    server: Getter<FileItemServer>;
    abortController: Getter<AbortController>;
    status: Getter<FileItemStatus>;
    process: () => Promise<boolean>;
    requestProcessing: () => void;
    progress: Getter<number>;
} & Omit<MonkListener<FileItemEvents, any>, "emit">;
declare type StoreActions = "STORE_UPDATED" | "CREATE_FILE_ITEM" | "PROCESS_FILE_ITEMS" | "PROCESS_FILE_ITEM" | "REQUEST_PROCESS_FILE_ITEM";
declare type AppEvents = "DID_CREATE_ITEM" | "DID_REQUEST_ITEM_PROCESSING" | "DID_PROCESSING_FAILED" | "DID_PROCESSING_COMPLETE" | "DID_COMPLETE_ITEM_PROCESSING_ALL" | StoreActions;
declare type MonkStoreState = {
    items: FileItem[];
    processingQueue: string[];
    maxParallelUploads: number;
};
declare type FileState = {
    id: string;
    file: File;
    server: FileItemServer;
    abortController: AbortController;
    status: FileItemStatus;
    progress: number;
};
declare type StoreHandlers = {
    CREATE_FILE_ITEM: () => void;
    CREATE_FILE_ITEMS: () => void;
    PROCESS_ITEM: () => void;
};

export { AppEvents, EventPayload, FileItem, FileItemServer, FileMonkApp, FileState, Getter, MonkListener, MonkStoreState, StoreActions, StoreHandlers };
