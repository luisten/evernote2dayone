# Migrate from Evernote into DayOne

![screenshot of Evernote app and DayOne app before and after migration](img/evernote_to_dayone.png)

This script is forked update from [hollyxu's evernote2dayone repo](https://github.com/hollyxu/evernote2dayone). It will migrate exported notes from Evernote into individual entries in DayOne.

## Prerequisites

* NodeJS & NPM
* [DayOne](https://dayoneapp.com/) desktop app
* [Evernote](https://evernote.com/) desktop app

## Import From Evernote to DayOne
1. Install the [Day One Command Line Interface](https://dayoneapp.com/guides/tips-and-tutorials/command-line-interface-cli/)

2. Export Evernote files as individual HTML into the default
"My Notes" folder. Then place the whole folder in the same directory as this script.

3. Install required packages
```
npm install
```

4. Run the import script!
All items will be tagged `EvernoteImport` and imported into the default journal.
```
node evernoteToDayOne.js
```

Please report any Issues on GitHub! Your feedback is appreciated.

## Changes from original

Evernote changed the way they export notes into HTML at some point after the original script was last updated. This fork aims to fix compatibility issues due to these changes. These include:

* Incompatible date formats
* Change to the naming of the export index file
* Import only the body of the notes (prevent import of useless CSS and HTML)

## Thanks
* [Turndown](https://github.com/domchristie/turndown)
* [jsdom](https://github.com/jsdom/jsdom)
* [hollyxu's original evernote2dayone](https://github.com/hollyxu/evernote2dayone)
