# gather-reverse-deps

BEM related reverse dependencies resolver

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Background

## Install

```sh
npm i -g gather-reverse-deps
```

## Usage

```sh
$ gather-reverse-deps button *.blocks libs/islands/*.blocks
attach
services-table_type_turkish
m-editor-popup_type_file
i-splendid
m-editor
m-editor-popup_type_picture
m-head-action
... etc
```

```js
const gatherDeps = require('gather-reverse-deps');

gatherDeps.invoke({}, {
    entities: 'button',
    levels: [
        '/Users/qfox/repos/islands/common.blocks',
        '/Users/qfox/repos/islands/deskpad.blocks',
        '/Users/qfox/repos/islands/desktop.blocks',
        '/Users/qfox/repos/islands/touch-pad.blocks',
        '/Users/qfox/repos/islands/touch-phone.blocks',
        '/Users/qfox/repos/islands/touch.blocks'
    ]
})
.then(console.log);
// [ { entity: { block: 'attach' } },
//   { entity: { block: 'services-table', mod: [Object] } },
//   { entity: { block: 'm-editor-popup', mod: [Object] } },
//   { entity: { block: 'i-splendid' } },
//   { entity: { block: 'm-editor' } },
//   { entity: { block: 'm-editor-popup', mod: [Object] } },
//   { entity: { block: 'm-head-action' } },
//   { entity: { block: 'm-head' } },
//   { entity: { block: 'm-head-menu' } },
//   ... etc
```

## Contribute

Feel free to open an issue or file a PR.

## License

MIT © 2016 Alexey Yaroshevich
