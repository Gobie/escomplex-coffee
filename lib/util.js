// Generated by CoffeeScript 1.10.0
(function() {
  var assignName, getChildren, getFullName, getName, safeName;

  getName = function(node) {
    return node.constructor.name;
  };

  getChildren = function(node) {
    return node.children;
  };

  safeName = function(node, defName) {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'object' && typeof node.value === 'string') {
      return node.value;
    }
    return defName || '<anonymous>';
  };

  getFullName = function(varNode) {
    var base, names;
    base = safeName(varNode.base);
    if (varNode.properties.length) {
      names = [base].concat(varNode.properties.filter(function(n) {
        return getName(n) === "Access";
      }).map(function(n) {
        return safeName(n.name);
      }));
      return names.join('.');
    } else {
      return base;
    }
  };

  assignName = function(node, parent) {
    if (getName(parent) === "Assign") {
      return getFullName(parent.variable);
    }
    return '<anonymous>';
  };

  module.exports = {
    getName: getName,
    getChildren: getChildren,
    safeName: safeName,
    getFullName: getFullName,
    assignName: assignName
  };

}).call(this);
