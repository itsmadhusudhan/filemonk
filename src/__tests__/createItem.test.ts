import { createItem } from "../app/createItem";
import { FileItemEvents, FileItemStatus } from "../app/enum";

afterEach(() => {
  jest.clearAllTimers();
});

describe("Test createItem", () => {
  test("Should return a valid fileItem", () => {
    const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

    expect(item).toBeTruthy();
    expect(item.file.get().name).toBe("test1");
    expect(item.server.get()).toMatchObject({ uploadUrl: "mywebsite" });
  });
});

describe("Test FileItem events", () => {
  test("Should emit `ITEM_UPDATED` event when process is called", () => {
    const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

    item.subscribe(FileItemEvents.ON_ITEM_UPDATED, (payload: any) => {
      expect(payload.type).toBe(FileItemEvents.ON_ITEM_UPDATED);
    });

    item.process();
  });

  test("Should emit `ON_FILE_PROCESS_START` event when process is called", () => {
    const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

    item.subscribe(FileItemEvents.ON_FILE_PROCESS_START, (payload: any) => {
      expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_START);
      expect(item.status.get()).toBe(FileItemStatus.UPLOADING);
    });

    item.process();
  });

  test("Should emit `ON_FILE_PROCESS_PROGRESS` event when process is called", () => {
    jest.useFakeTimers();
    const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

    item.subscribe(FileItemEvents.ON_FILE_PROCESS_PROGRESS, (payload: any) => {
      expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_PROGRESS);
    });

    const mockCallback = jest.fn();

    item.subscribe(FileItemEvents.ON_FILE_PROCESS_PROGRESS, mockCallback);

    item.process();

    // we just advace the timer
    jest.advanceTimersByTime(5000);

    expect(mockCallback).toBeCalled();
  });

  test("Should emit `ON_FILE_PROCESS_COMPLETE` event when process is called", () => {
    jest.useFakeTimers();
    const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

    const mockCallback = jest.fn();

    item.subscribe(FileItemEvents.ON_FILE_PROCESS_COMPLETE, mockCallback);

    item.subscribe(FileItemEvents.ON_FILE_PROCESS_COMPLETE, (payload: any) => {
      expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_COMPLETE);
      expect(item.status.get()).toBe(FileItemStatus.UPLOADED);
    });

    item.process();

    // we just advace the timer
    jest.advanceTimersByTime(5000);

    expect(mockCallback).toBeCalled();
  });
});
