/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require('../lib/start'),
      should  = require('should');

program
    .version('0.0.1')
    .option('-f, --foo <foo_type>', 'add some <foo_type>')
    .demand('foo');

program
    .command('setup [env]')
    .description('run setup commands for all envs')
    .option("-s, --setup_mode <mode>", "Which setup mode to use")
    .demand("setup_mode")
    .action(function(env, options){
      var mode = options.setup_mode || "normal";
      env = env || 'all';
      console.log('setup for %s env(s) with %s mode', env, mode);
    });

var helpInfo = program.helpInformation();
console.log(helpInfo);
/*helpInfo.should.include("[required] Which setup mode to use");*/

