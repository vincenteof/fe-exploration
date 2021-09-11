"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = require("fs");

var _path = require("path");

var _Module = _interopRequireDefault(require("./Module"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function createDependencyGraph(entry) {
  return (0, _Module["default"])(entry);
}

function flattenModules(graph) {
  var modules = [];
  var queue = [graph];

  while (queue.length > 0) {
    var cur = queue.pop();
    modules.push(cur);
    queue.push.apply(queue, _toConsumableArray(cur.dependencies));
  }

  return modules;
}

function createModuleMap(modules) {
  var moduleMap = '';
  moduleMap += '{';

  var _iterator = _createForOfIteratorHelper(modules),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var module = _step.value;
      moduleMap += "\"".concat(module.filePath, "\": function (exports, require) { ").concat(module.code, " },");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  moduleMap += '}';
  return moduleMap;
}

function addRuntime(moduleMap, entry) {
  return "\n  const modules = ".concat(moduleMap, ";\n  const entry = \"").concat(entry, "\";\n  function start({ modules, entry }) {\n    const moduleCache = {};\n    const require = moduleName => {\n      if (moduleCache[moduleName]) {\n        return moduleCache[moduleName];\n      }\n      const exports = {};\n      moduleCache[moduleName] = exports;\n      modules[moduleName](exports, require);\n      return moduleCache[moduleName];\n    }\n    require(entry);\n  }\n  start(entry);\n  ");
}

function bundle(graph) {
  var flattened = flattenModules(graph);
  var moduleMap = createModuleMap(flattened);
  var bundledCode = addRuntime(moduleMap, graph.filePath);
  return [{
    name: 'bundle.js',
    content: bundledCode
  }];
}

function build(_ref) {
  var entry = _ref.entry,
      _ref$outputFolder = _ref.outputFolder,
      outputFolder = _ref$outputFolder === void 0 ? '.' : _ref$outputFolder;
  var graph = createDependencyGraph(entry);
  var assets = bundle(graph);
  (0, _utils.ensureDirectoryExistence)(outputFolder);

  var _iterator2 = _createForOfIteratorHelper(assets),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var asset = _step2.value;
      (0, _fs.writeFileSync)((0, _path.join)(outputFolder, asset.name), asset.content, 'utf-8');
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

var _default = build;
exports["default"] = _default;