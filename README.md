# share-term
Share the terminal with your friends.

## Installation
Run the following commands to download and install the application:

```sh
$ npm install -g share-term
```

## Documentation
If you want to use this library as module, there you go!

### `ShareTerm(options)`
Creates a new instance of `ShareTerm`.

#### Params
- **Object** `options`: The options object:
 - `host` (String): The remote server host.

### `connected()`
This is called internally after the client is connected.

#### Return
- **ShareTerm** The `ShareTerm` instance.

### `connect(options, callback)`
Connects the client to the remote server.

#### Params
- **Object** `options`: The options object.
- **Function** `callback`: The callback function.

#### Return
- **ShareTerm** The `ShareTerm` instance.

### `create(callback)`
Creates a new terminal share session.

#### Params
- **Function** `callback`: The callback function.

#### Return
- **ShareTerm** The `ShareTerm` instance.

### `get(options, callback)`
Connects the client to an existing terminal share session.

#### Params
- **Object** `options`: An object containing the following fields:
 - `id` (String): The terminal share session id.
 - `stdout` (Stream): The output stream (default: `process.stdout`).

- **Function** `callback`: The callback function.

#### Return
- **ShareTerm** The `ShareTerm` instance.

## How to contribute
1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
