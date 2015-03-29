![](http://i.imgur.com/AI9aB44.png)

# `$ share-term`
Share the terminal with your friends.

It's possible to share it into another terminal or in a browser, both with request
control feature.

If you enjoy using *Share Term*, [supporting it](http://share-term.me/support)
would be really appreciated. :smile: :heart:

## Installation

```sh
$ npm install -g share-term
```

For the help content, run:

```sh
$ share-term -h
```

## Usage
### :earth_africa: Sharing the terminal
To share your terminal do:

```sh
$ share-term
```

You will get a session id which you will send to your friends.

### :tokyo_tower: Accessing a session
To join a terminal session, having the id `<id>` you have two ways:

 1. Open the [Share Term website](http://share-term.me/) and enter your id there.
    Then click the <kbd>Access</kbd> button. To request remote control click the
    <kbd>🗼</kbd> button in the right bottom side.
 2. Having `share-term` installed on your computer (see [Installation](#Installation))
    you can join the session using:

    ```sh
    # Without remote control
    $ share-term get <id>
    # With remote control
    $ share-term get <id> -c
    ```

## Documentation
If you want to use this library as module, check out the [DOCUMENTATION](/DOCUMENTATION.md) file.

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
