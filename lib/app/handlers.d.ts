import { MonkStoreState, StoreActions, AppEvents, FileItemEvents } from "../types";
export declare type StoreProp = {
    getState: () => MonkStoreState;
    setState: (newState: Partial<MonkStoreState>) => void;
    dispatch: (event: FileItemEvents | StoreActions | AppEvents, data: any) => void;
    query: (query: any, data?: any) => any;
};
export declare const createHandlers: (store: StoreProp) => any;
