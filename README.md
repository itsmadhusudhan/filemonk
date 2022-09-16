# FileMonk

File Monk is a javascript library to handle file uploads.

## Installation

You can use the github link to get the latest version on master

```json
"dependencies":{
    "filemonk":"https://github.com/itsmadhusudhan/filemonk.git"
}
```

To install specific version

```json
"dependencies":{
    "filemonk":"https://github.com/itsmadhusudhan/filemonk.git#v1.0.0"
}
```
## createApp

```js
const app = createApp()
```

## createApp with config

```js
const app = createApp({
    server:{
        uploadUrl:"<SERVER_URL_HERE>"
    }
})
```

**parameters**

| key                | type   | description                                   | required | default  |
| ------------------ | ------ | --------------------------------------------- | -------- | -------- |
| server             | Object | file upload server info                       | Yes      |          |
| maxParallelUploads | number | number of files that are uploaded in parallel | No       | 1        |
| name               | String | A name for the filemonk app instance          | No       | filemonk |

## addFile

```js
const app = createApp()

app.addFile(new File([], "Test1"));

// Override server information
app.addFile(new File([], "Test1"), {
    server: "<INSERT YOUR URL>",
});
```

## App Events

| Event name                       | Description                                 |
| -------------------------------- | ------------------------------------------- |
| DID_CREATE_ITEM                  | Emited when file item object is created     |
| DID_REQUEST_ITEM_PROCESSING      | file item added to the queue for processing |
| DID_PROCESSING_ITEM_NOT_FOUND    | file item not found to start processing     |
| DID_PROCESSING_ITEM_COMPLETE     | file item completed processing              |
| DID_COMPLETE_ALL_ITEM_PROCESSING | all the file items completed processing     |
| STORE_UPDATED                    | file monk store gets updated                |

## processFiles

This method will start processing all files

```js
const app = createApp()

app.processFiles()
```
## Event Subscription

```js
const app = createApp()

app.subscribe("STORE_UPDATED",({ type,data }) => {
    //  do something
})

// Emits only one time
app.subscribeOnce("STORE_UPDATED",({ type,data }) => {
    //  do something
})
```

## Event UnSubscription

```js
const app = createApp()

app.unsubscribe("STORE_UPDATED",callback)
```

## FileItem context

```js
const app = createApp()

app.addFile({
    ...
    context:{
        // PASS ANY DATA like key
    }
})

// access context from file item like this
app.subscribe("STORE_UPDATED",({ type,data }) => {
   const fileItem=data[0]

   const context= fileItem.context
})
```

## TODO

- [ ] Improve error handling during file item processing 
- [ ] Improve events handling
- [ ] Improve library build config
- [ ] Remove uuid as dependency
- [ ] Write tests