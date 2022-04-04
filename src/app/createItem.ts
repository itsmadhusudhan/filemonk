import {
  FileState,
  FileItemEvents,
  AppConfig,
  FileItemServer,
  InternalFileItem,
} from "../types";
import { v4 as uuid } from "uuid";
import { createListener } from "./createListener";
import axios from "axios";

export const createItem = (
  file: File,
  server: FileItemServer
): InternalFileItem => {
  const listener = createListener<FileItemEvents, any>();

  let state: FileState = {
    id: uuid(),
    file: file,
    server,
    status: "IDLE",
    abortController: new AbortController(),
    progress: 0,
  };

  const setState = (newState: Partial<FileState>) => {
    state = {
      ...state,
      ...newState,
    };

    listener.emit("ON_ITEM_UPDATED");
  };

  const requestProcessing = () => {
    setState({
      status: "IN_QUEUE",
    });
  };

  const process = async (config: AppConfig["server"]) => {
    setState({
      status: "UPLOADING",
    });

    listener.emit("ON_FILE_PROCESS_START");

    const server = state.server;

    const formData = new FormData();

    formData.append("file", state.file);

    Object.keys(server.data).forEach((key) => {
      formData.append(key, server.data[key]);
    });

    axios(server.config.uploadUrl!, {
      method: server.config.method,
      data: formData,
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;

        setState({
          progress,
        });

        listener.emit("ON_FILE_PROCESS_PROGRESS", {
          id: state.id,
          progress: state.progress,
        });
      },
    })
      .then((r) => {
        setState({
          status: "UPLOADED",
        });

        listener.emit("ON_FILE_PROCESS_COMPLETE", r);
      })
      .catch((e) => {
        setState({
          status: "FAILED",
        });

        listener.emit("ON_FILE_PROCESS_FAILED", e);
      });

    // const timer = setInterval(() => {
    //   setState({
    //     progress: state.progress + 20,
    //   });

    //   listener.emit({
    //     type: "ON_FILE_PROCESS_PROGRESS",
    //     data: {
    //       id: state.id,
    //       progress: state.progress,
    //     },
    //   });

    //   if (state.progress >= 100) {
    //     clearInterval(timer);

    //     setState({
    //       status: "UPLOADED",
    //     });

    //     listener.emit({
    //       type: "ON_FILE_PROCESS_COMPLETE",
    //     });
    //   }
    // }, 1000);

    return true;
  };

  const api = {
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

  return api;
};
