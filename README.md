# Conventional Comments Browser Extension

This browser extension makes it wildly easy to adopt [Conventional Comments][cc] when working on GitHub.

### Installation

* TODO

### Usage

The extension is written exclusively for GitHub, but I'd like to support GitLab and BitBucket in the future.

Once you have the extension installed, navigating to the `Files changed` tab on any PR and opening a comment dialog box should cause some buttons to populate.

Each of the buttons correlates to a [Conventional Comments `Label`][cc_labels]. Clicking one of them drops the basic format of a Conventional Comment into the dialog box.

Now you say, "Neat, but that doesn't seem cool enough for me." I totally agree, that's why I added hotkeys.

#### Hotkeys

All of the hotkeys are prefixed with `alt` (`opt`) and `ctrl`.

To append a non-blocking `Praise` comment: `alt` + `ctrl` + `p`.

Wow magic! But we can do more.

To append a blocking `Issue` comment: `alt` + `ctrl` + `shift` + `i`.

Incredible!

### Contributing

You're more than welcome to submit issues, features, or bug fixes to this repository!

[cc]: https://conventionalcomments.org/
[cc_labels]: https://conventionalcomments.org/#labels