const commander = require('commander'),
      Command   = commander.Command,
      fs        = require('fs');


function Commodore(name) {
  this.requiredOpts = [];

  Command.call(this, name);
}

/**
 * Inherit from `Command.prototype`
 */
Commodore.prototype.__proto__ = Command.prototype;

module.exports = new Commodore();

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
 * Require an option. Option must already be defined.
 *
 * @param {String} optionName
 * @api public
 */
Commodore.prototype.require = function(optionName) {
  var option = this.optionFor(optionName);
  if (!option) {
    this.invalidRequiredOption(optionName);
  }

  option.description = '[required] ' + option.description;

  this.requiredOpts.push(optionName);

  return this;
};

Commodore.prototype.parse = function(argv) {
  Command.prototype.parse.call(this, argv);

  // copy loaded data to this.
  for (var key in this.loadedData) {
    if (!(key in this)) {
      this[key] = this.loadedData[key];
    }
  }

  // check required options.
  var self = this;
  this.requiredOpts.forEach(function(requiredOption) {
    if (! (requiredOption in self)) {
      var option = self.optionFor(requiredOption);
      self.missingRequiredOption(option.flags);
    }
  });
};

Commodore.prototype.helpInformation = function() {
  var helpInfo = Command.prototype.helpInformation.call(this);

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
 * Option `optionName` not defined, cannot be required.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.invalidRequiredOption = function(optionName) {
  console.error();
  console.error("  invalid required option `%s`", optionName);
  console.error();
  process.exit(1);
}

/**
 * Option `optionName` not entered.
 *
 * @param {optionName}
 * @api private
 */

Commodore.prototype.missingRequiredOption = function(optionName) {
  console.error();
  console.error("  option `%s` missing", optionName);
  console.error();
  process.exit(1);
};

