import { AppEvents, MonkListener, StoreActions, FileItemEvents, AppConfig } from "../types";
/**
 *
 * @param {MonkListener} listener
 * @param {StoreConfig} config
 * @returns
 */
export declare const createStore: (listener: MonkListener<AppEvents, any>, config: AppConfig) => {
    getState: () => {
        items: import("../types").InternalFileItem[];
        processingQueue: string[];
        appConfig: AppConfig;
    };
    dispatch: (event: FileItemEvents | StoreActions | AppEvents, data: any) => void;
    query: (str: any, ...args: any) => any;
    clearStore: () => void;
};
