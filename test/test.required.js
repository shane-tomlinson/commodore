/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require('../lib/start'),
      should  = require('should');

program
    .version('0.0.1')
    .option('-f, --foo <foo_type>', 'add some <foo_type>')
    .require('foo');

var helpInfo = program.helpInformation();
helpInfo.should.include("[required]");

