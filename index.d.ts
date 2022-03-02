declare type FileMonkApp = {
    name: string;
    addFile: (file: File, server: FileItemServer) => void;
    getState: () => any;
    subscribe: (event: AppEvents, cb: (data: any) => void) => void;
};
declare type FileItemServer = {
    uploadUrl: string;
    headers?: Object;
};
declare type StoreEvents = "STORE_UPDATED";
declare type AppEvents = "DID_CREATE_FILE" | StoreEvents;

declare const createApp: (name?: string) => FileMonkApp;

export { createApp };
