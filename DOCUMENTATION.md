## Documentation

You can see below the API reference of this module.

### `ShareTerm(options)`
Creates a new instance of `ShareTerm`.

#### Params

- **Object** `options`: The options object:
 - `host` (String): The remote server host.

#### Return
- **ShareTerm** The `ShareTerm` instance.

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

