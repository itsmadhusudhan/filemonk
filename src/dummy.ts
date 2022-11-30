type MonkPlugin = {
  id: string;
  name: string;
  onCreate(): void;
  onDestroy(): void;
};
/**
 *  logger - multiple
 *  uploader - single
 *  downloader - single
 */
type Emitter = {};

interface FileMonk {
  store: any;
  plugins: MonkPlugin[];
  emitter: Emitter;
  addFiles: (file: File) => void;
}

type MonkEvents =
  | "FILE_ADDED"
  | "PROCESSING_FILE"
  | "FILE_STATUS_UPDATED"
  | "FILE_PROCESSING_COMPLETE";
