import { FileItem, InternalFileItem } from "../types";

export const transformFileItem = (item: InternalFileItem): FileItem => {
  const { file, id, status, progress, server } = item;

  return {
    file: file.get(),
    id: id.get(),
    name: file.get().name,
    server: server.get(),
    status: status.get(),
    progress: progress.get(),
  };
};
