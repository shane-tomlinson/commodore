# commodore

  A complete solution for [node.js](http://nodejs.org) command-line interfaces. Commodore is an extension of [commander](https://github.com/visionmedia/commander.js) from TJ Holowaychuk, which is in turn inspired by Ruby's commander.

## Installation

    $ npm install commander

## Option parsing

  Since commodore is an extension of commander, all [commander options](https://github.com/visionmedia/commander.js/blob/master/Readme.md) are supported.

## .demand(optionName)
  Demand an option `optionName`

```js
program
  .option('-f, --foo <foo_type>', 'type of foo')
  .demand('foo')
```

## .loadable(optionName)
  Attempt to load `optionName` from the JSON config file declared in `.load`

```js
program
  .option('-f, --foo <foo_type>', 'type of foo')
  .loadable('foo')
```

## .oneof(optionName, choices)
  Demand that the value of `optionName` be one of `choices`

```js
program
  .option('-f, --foo <foo_type>', 'type of foo')
  .oneof('foo', ['bar', 'baz', 'buz'])
```

## .load(configPath)
  Load `loadable` options from a configuration file.

```js
program
  .option('-f, --foo <foo_type>', 'type of foo')
  .loadable('foo')
  .load('~/.commodore/config.json')
```

## Why the fork/extension?

I love commander, I also love [optimist](https://github.com/substack/node-optimist). 
Both are missing features. TJ does not want to add complexity to the commander library,
so I created a library on top of his to fulfill my own needs.

## License
(The MIT License)

Copyright (c) 2013 Shane Tomlinson &lt;shane@shanetomlinson.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

