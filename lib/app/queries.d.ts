import { MonkStoreState, StoreActions, AppEvents, FileItemEvents } from "../types";
export declare type StoreProp = {
    getState: () => MonkStoreState;
    setState: (newState: Partial<MonkStoreState>) => void;
    dispatch: (event: FileItemEvents | StoreActions | AppEvents, data: any) => void;
};
export declare const queries: {
    GET_IDLE_ITEMS: string;
    GET_MAX_PARALLEL_UPLOADS_ITEMS: string;
    GET_ITEMS_BY_STATUS: string;
    GET_PROCESSED_ITEMS: string;
    GET_SERVER_CONFIG: string;
};
export declare const createQueryHandlers: (store: StoreProp) => any;
