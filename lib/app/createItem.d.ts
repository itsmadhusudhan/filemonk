import { FileState, FileItemServer, InternalFileItem } from "../types";
export declare const createItem: (file: File, server: FileItemServer, context?: FileState["context"]) => InternalFileItem;
