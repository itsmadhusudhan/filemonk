import { createListener } from "../app/createListener";
import { createApp } from "../index";

describe("File Monk Creation", () => {
  test("Should be able to create FileMonk App instance with given name", () => {
    const app = createApp({
      name: "testMonk",
      server: { uploadUrl: "" },
    });
    expect(app.name).toBe("testMonk");
  });

  test("Should be able to `addFile` to the app", async () => {
    const app = createApp();

    const spy = jest.spyOn(app, "addFile");

    app.addFile({ file: new File([], "test file1"), server: { data: {} } });

    expect(app.addFile).toBeCalled();

    spy.mockRestore();
  });

  test("Should be able to receive events when file is added", async () => {
    const app = createApp();

    const mockCallback = jest.fn();

    app.subscribeOnce("DID_CREATE_ITEM", mockCallback);

    app.subscribeOnce("STORE_UPDATED", mockCallback);
    app.addFile({ file: new File([], "test file1"), server: { data: {} } });

    expect(mockCallback).toBeCalledTimes(2);
  });
});

describe("File Monk upload tests", () => {
  test("Should be able to process added files", () => {
    const app = createApp();

    const mockCallback = jest.fn();

    // app.addFile(new File([], "test file1"), { uploadUrl: "" });

    app.processFiles();
  });
});

describe("File Monk listener tests", () => {
  test("Should be able to process added files", () => {
    const listener = createListener();
  });
});
