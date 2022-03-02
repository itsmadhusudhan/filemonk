import { FileItemServer, FileState } from "../types";
import { v4 as uuid } from "uuid";
import { createListener } from "./createListener";
import { FileItemEvents, FileItemStatus } from "./enum";

export const createItem = (file: File, server: FileItemServer) => {
  const listener = createListener<FileItemEvents, any>();

  let state: FileState = {
    id: uuid(),
    file: file,
    server: server,
    status: FileItemStatus.IDLE,
    abortController: new AbortController(),
    progress: 0,
  };

  const setState = (newState: Partial<FileState>) => {
    state = {
      ...state,
      ...newState,
    };

    listener.emit({
      type: FileItemEvents.ON_ITEM_UPDATED,
    });
  };

  const requestProcessing = () => {
    setState({
      status: FileItemStatus.IN_QUEUE,
    });
  };

  const process = async () => {
    setState({
      status: FileItemStatus.UPLOADING,
    });

    listener.emit({
      type: FileItemEvents.ON_FILE_PROCESS_START,
    });

    const timer = setInterval(() => {
      setState({
        progress: state.progress + 20,
      });

      listener.emit({
        type: FileItemEvents.ON_FILE_PROCESS_PROGRESS,
        data: {
          id: state.id,
          progress: state.progress,
        },
      });

      if (state.progress >= 100) {
        clearInterval(timer);

        setState({
          status: FileItemStatus.UPLOADED,
        });

        listener.emit({
          type: FileItemEvents.ON_FILE_PROCESS_COMPLETE,
        });
      }
    }, 1000);

    return true;
  };

  return {
    id: { get: () => state.id },
    file: { get: () => state.file },
    abortController: { get: () => state.abortController },
    server: { get: () => state.server },
    status: { get: () => state.status },
    progress: { get: () => state.progress },
    requestProcessing,
    process,
    subscribe: listener.subscribe,
    unsubscribe: listener.unsubscribe,
    subscribeOnce: listener.subscribeOnce,
  };
};
