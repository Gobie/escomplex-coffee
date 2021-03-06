// Generated by CoffeeScript 1.10.0
(function() {
  var call, getChildren, setupSyntax, syntax, trait, util;

  trait = require('escomplex-traits');

  util = require('./util');

  getChildren = util.getChildren;

  call = require('./call');

  syntax = {
    Block: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Assign: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren, function(node) {
          return util.getFullName(node.variable);
        });
      }
    },
    Value: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Literal: {
      trait: function() {
        var getOp;
        getOp = function(node) {
          return node.value;
        };
        return trait.actualise(0, 0, void 0, getOp, getChildren);
      }
    },
    Access: {
      trait: function() {
        return trait.actualise(1, 0, '.', void 0, getChildren);
      }
    },
    Call: {
      trait: function() {
        var handleDeps;
        handleDeps = function(node, clearAliases) {
          if (clearAliases) {
            call.amdPathAliases = {};
          }
          if (node.variable && util.getName(node.variable) === "Value" && node.variable.properties.length === 0 && util.getName(node.variable.base) === "Literal" && node.variable.base.value === "require") {
            return call.processRequire(node);
          }
          if (node.variable && util.getName(node.variable) === "Value" && node.variable.properties.length === 1 && util.getName(node.variable.base) === "Literal" && node.variable.base.value === "require" && util.getName(node.variable.properties[0]) === "Access" && util.getName(node.variable.properties[0].name) === "Literal" && node.variable.properties[0].name.value === "config") {
            return call.processAmdRequireConfig(node.args);
          }
        };
        return trait.actualise(1, 0, '()', void 0, getChildren, void 0, void 0, handleDeps);
      }
    },
    Code: {
      trait: function() {
        return trait.actualise(1, 0, 'function', '<anonymous>', getChildren, void 0, true);
      }
    },
    Param: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Bool: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    For: {
      trait: function(settings) {
        var complexity;
        complexity = function(node) {
          var score;
          score = 0;
          if (node.guard) {
            score++;
          }
          if (settings.forin) {
            score++;
          }
          return score;
        };
        return trait.actualise(1, complexity, 'for', void 0, getChildren);
      }
    },
    Index: {
      trait: function() {
        return trait.actualise(1, 0, '[]', void 0, getChildren);
      }
    },
    If: {
      trait: function() {
        var calcLoc, ops;
        calcLoc = function(node) {
          if (node.alternate) {
            return 2;
          } else {
            return 1;
          }
        };
        ops = [
          'if', {
            identifier: 'else',
            filter: function(node) {
              return !!node.alternate;
            }
          }
        ];
        return trait.actualise(calcLoc, 1, ops, void 0, getChildren);
      }
    },
    Op: {
      trait: function() {
        var getOp;
        getOp = function(node) {
          return node.operator;
        };
        return trait.actualise(0, 0, getOp, void 0, getChildren);
      }
    },
    Return: {
      trait: function() {
        return trait.actualise(1, 0, 'return', void 0, getChildren);
      }
    },
    Parens: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Obj: {
      trait: function() {
        return trait.actualise(0, 0, '{}', void 0, getChildren);
      }
    },
    Arr: {
      trait: function() {
        return trait.actualise(0, 0, '[]', void 0, getChildren);
      }
    },
    Undefined: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Null: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Splat: {
      trait: function() {
        return trait.actualise(0, 0, void 0, void 0, getChildren);
      }
    },
    Class: {
      trait: function() {
        return trait.actualise(0, 0, 'class', void 0, getChildren);
      }
    },
    Slice: {
      trait: function() {
        return trait.actualise(0, 0, '[]', void 0, getChildren);
      }
    },
    Range: {
      trait: function() {
        return trait.actualise(0, 0, '[]', void 0, getChildren);
      }
    },
    Existence: {
      trait: function() {
        return trait.actualise(0, 0, '!', void 0, getChildren);
      }
    },
    In: {
      trait: function() {
        return trait.actualise(0, 0, 'in', void 0, getChildren);
      }
    },
    While: {
      trait: function() {
        var hasCondition;
        hasCondition = function(node) {
          var comp;
          comp = 0;
          if (node.condition) {
            comp++;
          }
          if (node.guard) {
            comp++;
          }
          return comp;
        };
        return trait.actualise(1, hasCondition, 'while', void 0, getChildren);
      }
    },
    Extends: {
      trait: function() {
        return trait.actualise(0, 0, 'extends', void 0, getChildren);
      }
    },
    Switch: {
      trait: function(settings) {
        var getCases;
        getCases = function(node) {
          var cases;
          if (!settings.switchcase) {
            return 0;
          }
          cases = node.cases.length;
          if (node.otherwise) {
            cases++;
          }
          return cases;
        };
        return trait.actualise(1, getCases, 'switch', void 0, getChildren);
      }
    },
    Throw: {
      trait: function() {
        return trait.actualise(1, 0, 'throw', void 0, getChildren);
      }
    },
    Try: {
      trait: function(settings) {
        var haveRecovery;
        haveRecovery = function(node) {
          if (!settings.trycatch) {
            return 0;
          }
          if (node.recovery) {
            return 1;
          } else {
            return 0;
          }
        };
        return trait.actualise(1, haveRecovery, void 0, void 0, getChildren);
      }
    }
  };

  setupSyntax = function(settings) {
    var name, obj, syntaxes;
    syntaxes = {};
    for (name in syntax) {
      obj = syntax[name];
      syntaxes[name] = obj.trait(settings);
    }
    return syntaxes;
  };

  module.exports = setupSyntax;

}).call(this);
