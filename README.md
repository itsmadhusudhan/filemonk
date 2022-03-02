# FileMonk

File Monk is a javascript library to handle file uploads.

**NOTE:** Library is still WIP

## createApp

```js
const app = createApp()
```

## addFile

```js
const app = createApp()

app.addFile(new File([], "Test1"), {
    server: "<INSERT YOUR URL>",
});
```

## events

```js
const app = createApp()

app.subscribe("STORE_UPDATED",({ type,data })=>{
    //  do something
})
```