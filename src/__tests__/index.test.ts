import { createApp } from "../index";

describe("File Monk Creation", () => {
  test("Should be able to create FileMonk App instance with given name", () => {
    const app = createApp({ name: "testMonk" });

    expect(app.name).toBe("testMonk");
  });
  test("Should be able to `addFile` to the app", async () => {
    const app = createApp();

    const spy = jest.spyOn(app, "addFile");

    app.addFile(new File([], "test file1"), { uploadUrl: "" });

    expect(app.addFile).toBeCalled();

    spy.mockRestore();
  });
  test("Should be able to receive events when file is added", async () => {
    const app = createApp();

    const mockCallback = jest.fn();

    app.subscribe("DID_CREATE_ITEM", mockCallback);

    app.subscribe("STORE_UPDATED", mockCallback);

    app.addFile(new File([], "test file1"), { uploadUrl: "" });

    expect(mockCallback).toBeCalledTimes(2);
  });
});

describe("File Monk upload tests", () => {
  test("Should be able to process added files", () => {
    const app = createApp();

    const mockCallback = jest.fn();

    app.addFile(new File([], "test file1"), { uploadUrl: "" });

    app.processFiles();
  });
});
