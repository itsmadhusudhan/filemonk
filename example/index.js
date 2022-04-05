// import { createApp } from "../lib";
const app = FileMonk.createApp({
  maxParallelUploads: 2,
  server: {
    method: "POST",
    uploadUrl: "/",
  },
});
const input = document.getElementById("file-input");
const clearApp = document.getElementById("clear-app");

clearApp.addEventListener("click", () => {
  app.resetAppStore();
});

input.onchange = (e) => {
  // console.log(e.target.files);
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    app.addFile({
      file,
      server: {
        data: {
          parentFolderId: "SOME_FOLDER",
        },
      },
    });
  });
  app.processFiles();
};
// app.subscribe("DID_COMPLETE_ALL_ITEM_PROCESSING", (d) => console.log(d));
app.subscribe("DID_PROCESSING_ITEM_COMPLETE", console.log);

const uploads = document.getElementById("uploads");

app.subscribe("STORE_UPDATED", (state) => {
  const items = state.data.items;
  uploads.innerHTML = "";
  items.map((i) => {
    const elm = document.createElement("div");
    elm.id = i.id;
    elm.innerHTML = `name: ${i.name} - status: ${i.status} - ${i.progress}`;
    uploads.appendChild(elm);
    return elm;
  });
});
