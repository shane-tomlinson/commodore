/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require('../lib/start'),
      path    = require('path'),
      should  = require('should');

program
    .version('0.0.1')
    .option('-b, --bar <bar_type>', 'add some <bar_type>')
    .require('bar')
    .load(path.join(__dirname, "config", "test-config.json"))
    .parse(['node', 'test']);

program.bar.should.be.equal("baz");;

