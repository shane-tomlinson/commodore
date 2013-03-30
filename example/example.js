#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require('../lib/start'),
      path    = require('path'),
      fs      = require('fs');

const CONFIG_PATH = path.join(getUserHome(), ".test", "config.json");

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}


program
    .version('0.0.1')
    .option('-t, --type <type>', 'add support for <type>')
    .require('type')
    .option('-p, --pie <pie>', 'specify a <pie>')
    .require('pie')
    .option('-a', 'an option')
    .require('a')
    .load(CONFIG_PATH)
    .parse(process.argv);


console.log(program.pie, "pie with", program.type);
