/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require('../lib/start'),
      path    = require('path'),
      should  = require('should');

program
    .version('0.0.1')
    .option('--onlyone <option>', 'User must choose one from list')
    .oneof('onlyone', ['option_a', 'option_b', 'option_c']);

var helpInfo = program.helpInformation();
helpInfo.should.include("option_a");
helpInfo.should.include("option_b");
helpInfo.should.include("option_c");
