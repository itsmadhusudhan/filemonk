import { createItem } from "../app/createItem";
import { FileItemServer } from "../types";
import { transformFileItem } from "../utils/transformFileItem";

describe("Test createItem creation", () => {
  // What is a valid file item?
  it("Should create valid file item", () => {
    const file = new File([], "file");

    const server: FileItemServer = {
      config: {
        uploadUrl: "/uploadfile",
        method: "POST",
        requestHeaders: {},
      },
      data: {},
    };

    const fileItem = createItem(file, server);

    // has a unique id
    expect(fileItem.id.get()).toBeDefined();
    // Has idle as initial status
    expect(fileItem.status.get()).toBe("IDLE");
    // initial progress is 0
    expect(fileItem.progress.get()).toBe(0);
    // file item has the file
    expect(fileItem.file.get()).toBe(file);
    // file item has the passed server object
    expect(fileItem.server.get()).toBe(server);
  });

  it("File item should have the passed context", () => {
    const file = new File([], "file");

    const server: FileItemServer = {
      config: {
        uploadUrl: "/uploadfile",
        method: "POST",
        requestHeaders: {},
      },
      data: {},
    };

    const fileItem = createItem(file, server, { parentId: "Home" });

    expect(fileItem.context).toMatchObject({ parentId: "Home" });
  });
});

describe("Test file item transformation", () => {
  // beforeEach(() => {
  //   jest.mock("uuid");

  //   const uuidSpy = jest.spyOn(require("uuid"), "v4");

  //   uuidSpy.mockReturnValue("6eeb0663-e0bf-4fe2-a509-f6c46549f796");
  // });

  test("Should return a valid transformed file item", () => {
    const file = new File([], "file");

    const server: FileItemServer = {
      config: {
        uploadUrl: "/uploadfile",
        method: "POST",
        requestHeaders: {},
      },
      data: {},
    };

    const fileItem = createItem(file, server);

    const { id, ...result } = transformFileItem(fileItem);

    expect(result).toStrictEqual({
      file: file,
      // id: "6eeb0663-e0bf-4fe2-a509-f6c46549f796",
      name: "file",
      server: {
        config: {
          uploadUrl: "/uploadfile",
          method: "POST",
          requestHeaders: {},
        },
        data: {},
      },
      status: "IDLE",
      progress: 0,
      context: {},
    });
  });
});

// describe("Test createItem", () => {
//   test("Should return a valid fileItem", () => {
//     const item = createItem(new File([], "test1"), {
//       config: { uploadUrl: "mywebsite", method: "POST" },
//       data: {},
//     });

//     expect(item).toBeTruthy();
//     expect(item.file.get().name).toBe("test1");
//     expect(item.server.get().config).toMatchObject({
//       uploadUrl: "mywebsite",
//       method: "POST",
//     });
//   });
// });

// describe("Test FileItem events", () => {
//   test("Should emit `ITEM_UPDATED` event when process is called", () => {
//     const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

//     item.subscribe(FileItemEvents.ON_ITEM_UPDATED, (payload: any) => {
//       expect(payload.type).toBe(FileItemEvents.ON_ITEM_UPDATED);
//     });

//     item.process();
//   });

//   test("Should emit `ON_FILE_PROCESS_START` event when process is called", () => {
//     const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

//     item.subscribe(FileItemEvents.ON_FILE_PROCESS_START, (payload: any) => {
//       expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_START);
//       expect(item.status.get()).toBe(FileItemStatus.UPLOADING);
//     });

//     item.process();
//   });

//   test("Should emit `ON_FILE_PROCESS_PROGRESS` event when process is called", () => {
//     jest.useFakeTimers();
//     const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

//     item.subscribe(FileItemEvents.ON_FILE_PROCESS_PROGRESS, (payload: any) => {
//       expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_PROGRESS);
//     });

//     const mockCallback = jest.fn();

//     item.subscribe(FileItemEvents.ON_FILE_PROCESS_PROGRESS, mockCallback);

//     item.process();

//     // we just advace the timer
//     jest.advanceTimersByTime(5000);

//     expect(mockCallback).toBeCalled();
//   });

//   test("Should emit `ON_FILE_PROCESS_COMPLETE` event when process is called", () => {
//     jest.useFakeTimers();
//     const item = createItem(new File([], "test1"), { uploadUrl: "mywebsite" });

//     const mockCallback = jest.fn();

//     item.subscribe(FileItemEvents.ON_FILE_PROCESS_COMPLETE, mockCallback);

//     item.subscribe(FileItemEvents.ON_FILE_PROCESS_COMPLETE, (payload: any) => {
//       expect(payload.type).toBe(FileItemEvents.ON_FILE_PROCESS_COMPLETE);
//       expect(item.status.get()).toBe(FileItemStatus.UPLOADED);
//     });

//     item.process();

//     // we just advace the timer
//     jest.advanceTimersByTime(5000);

//     expect(mockCallback).toBeCalled();
//   });
// });
