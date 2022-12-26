import axios from "axios";
import { nanoid } from "nanoid";

import { createListener } from "./createListener";

import {
  FileState,
  FileItemEvents,
  AppConfig,
  FileItemServer,
  InternalFileItem,
} from "../types";

export const createItem = (
  file: File,
  server: FileItemServer,
  context: FileState["context"] = {}
): InternalFileItem => {
  const listener = createListener<FileItemEvents, any>();

  let state: FileState = {
    id: nanoid(),
    file: file,
    server,
    status: "IDLE",
    abortController: new AbortController(),
    progress: 0,
    context: context,
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

  const process = async (appconfig: AppConfig["server"]) => {
    setState({
      status: "UPLOADING",
    });

    listener.emit("ON_FILE_PROCESS_START");

    const { data, config } = state.server;

    const formData = new FormData();

    formData.append("file", state.file);

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    axios(config.uploadUrl!, {
      method: config.method,
      data: formData,
      headers: config.requestHeaders,
      xsrfCookieName: config.xsrfCookieName,
      xsrfHeaderName: config.xsrfHeaderName,
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
      signal: state.abortController.signal,
    })
      .then((r) => {
        setState({
          status: "UPLOADED",
        });

        if (state.context.debug) {
          console.log(r);
        }

        listener.emit("ON_FILE_PROCESS_COMPLETE", r);
      })
      .catch((e) => {
        setState({
          status: "FAILED",
        });

        if (state.context.debug) {
          console.log(e);
        }
        listener.emit("ON_FILE_PROCESS_FAILED", e);
      });
  };

  const api = {
    id: { get: () => state.id },
    file: { get: () => state.file },
    abortController: { get: () => state.abortController },
    server: { get: () => state.server },
    status: { get: () => state.status },
    progress: { get: () => state.progress },
    context: state.context,
    requestProcessing,
    process,
    subscribe: listener.subscribe,
    unsubscribe: listener.unsubscribe,
    subscribeOnce: listener.subscribeOnce,
    unsubscribeAll: listener.unsubscribeAll,
  };

  return api;
};
