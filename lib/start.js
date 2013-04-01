const commander = require('commander'),
      Command   = commander.Command,
      fs        = require('fs');


function Commodore(name) {
  Command.call(this, name);
}

/**
 * Inherit from `Command.prototype`
 */
Commodore.prototype.__proto__ = Command.prototype;

module.exports = new Commodore();

/**
 * Mark a field as loadable.
 *
 * @param {String} optionName
 * @api public
 */
Commodore.prototype.loadable = function(optionName) {
  var option = this.optionFor(optionName);
  if (!option) {
    this.invalidLoadableOption(optionName);
  }

  option.loadable = true;
  option.description = option.description + " (loadable)";

  return this;
};

/**
 * Load options from a configuration file.
 *
 * @param {String} configPath
 * @api public
 */
Commodore.prototype.load = function(configPath) {
  var data;
  try {
    data = fs.readFileSync(configPath, 'utf8');
  } catch(e) {
    if (e.code === "ENOENT") {
      // config file does not exist.
      data = "{}";
    } else {
      throw e;
    }
  }

  try {
    this.loadedData = JSON.parse(data);
    this.configPath = configPath;
  } catch(e) {
    this.invalidJSON(configPath, String(e));
  }

  return this;
};

/**
 * Demand an option `optionName`.
 *
 * @param {String} optionName
 * @api public
 */

Commodore.prototype.demand = function(optionName) {
  var option = this.optionFor(optionName);
  if (!option) {
    this.invalidDemandedOption(optionName);
  }

  option.description = '[required] ' + option.description;
  option.demand = true;

  return this;
};

/**
 * Demand that the value of `optionName` be one of `choices`.
 *
 * @param {String} optionName
 * @param {Array} choices
 * @api public
 */

Commodore.prototype.oneof = function(optionName, choices) {
  var option = this.optionFor(optionName);
  if (!option) {
    this.invalidOneOfOption(optionName);
  }

  option.description = option.description + " [" + choices.join(", ") + "]";

  var self=this;
  this.on(optionName, function(val) {
    if (choices.indexOf(val) === -1) {
      self.invalidOneOfChoice(optionName, val, choices);
    }
  });
  return this;
};

Commodore.prototype.importLoadedData = function() {
  // copy loaded data to this.
  for (var optionName in this.loadedData) {
    var option = this.optionFor(optionName);
    if (option.loadable && !(optionName in this)) {
      this[optionName] = this.loadedData[optionName];
    }
  }
};

Commodore.prototype.checkDemanded = function() {
  // check required options.
  var self = this;
  this.options.forEach(function(option) {
    if (option.demand && !(option.name() in self)) {
      self.missingDemandedOption(option.flags);
    }
  });
};

Commodore.prototype.command = function(name, desc) {
  var args = name.split(/ +/);
  var cmd = new Commodore(args.shift());
  if (desc) cmd.description(desc);
  if (desc) this.executables = true;
  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;
  if (desc) return this;
  return cmd;
};

Commodore.prototype.parse = function(argv) {
  Command.prototype.parse.call(this, argv);

  this.importLoadedData();
  this.checkDemanded();

  return this;
};

Commodore.prototype.helpInformation = function() {
  var helpInfo = Command.prototype.helpInformation.call(this);

  if (this.description()) {
    helpInfo = "\n  " + this.description() + "\n" + helpInfo;
  }

  if (this.configPath) {
    helpInfo += "\n  Config file: " + this.configPath + "\n\n";
  }

  return helpInfo;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Commodore.prototype.optionFor = function(arg) {
  if (/-/.test(arg)) {
    return Command.prototype.optionFor.call(this, arg);
  }

  // arg does not have a -, search both short and long codes.
  for (var i = 0, option; option = this.options[i]; ++i) {
    if (option.is("-" + arg) || option.is("--" + arg)) {
      return option;
    }
  }
};

/**
 * Invalid JSON in `config` file
 *
 * @param {String} configPath
 * @param {Error} err
 * @api private
 */

Commodore.prototype.invalidJSON = function(configPath, err) {
  console.error();
  console.error("  invalid JSON in %s", configPath);
  console.error(err);
  console.error();
  process.exit(1);
};

/**
 * Option `optionName` not defined, cannot be loadable.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.invalidLoadableOption = function(optionName) {
  console.error();
  console.error("  invalid loadable option `%s`", optionName);
  console.error();
  process.exit(1);
}

/**
 * Option `optionName` not defined, cannot be required.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.invalidDemandedOption = function(optionName) {
  console.error();
  console.error("  invalid required option `%s`", optionName);
  console.error();
  process.exit(1);
};

/**
 * Option `optionName` not entered.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.missingDemandedOption = function(optionName) {
  console.error();
  console.error("  option `%s` missing", optionName);
  console.error();
  process.exit(1);
};

/**
 * Option `optionName` not defined, cannot be required.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.invalidOneOfOption = function(optionName) {
  console.error();
  console.error("  invalid oneof option `%s`", optionName);
  console.error();
  process.exit(1);
};

/**
 * Invalid choice for option `optionName`
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.invalidOneOfChoice = function(optionName, val, options) {
  console.error();
  console.error("  `%s` must be one of: %s", optionName, options.join(', '));
  console.error();
  process.exit(1);
};

