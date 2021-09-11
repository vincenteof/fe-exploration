"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = require("fs");

var _path = require("path");

var _core = require("@babel/core");

var _traverse = _interopRequireDefault(require("@babel/traverse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Module = /*#__PURE__*/function () {
  function Module(filePath) {
    _classCallCheck(this, Module);

    this.filePath = filePath;
    this.content = (0, _fs.readFileSync)(filePath, 'utf-8');
    this.ast = (0, _core.parseSync)(this.content);
    this.dependencies = this.findDependencies();

    var _transformFromAst = (0, _core.transformFromAst)(this.ast, null, {
      presets: ["@babel/preset-env"]
    }),
        code = _transformFromAst.code,
        ast = _transformFromAst.ast;

    this.code = code;
    this.ast = ast;
  }

  _createClass(Module, [{
    key: "findDependencies",
    value: function findDependencies() {
      var _this = this;

      var dependencies = [];
      (0, _traverse["default"])(this.ast, {
        ImportDeclaration: function ImportDeclaration(_ref) {
          var node = _ref.node;
          var absolutePath = (0, _path.join)((0, _path.dirname)(_this.filePath), node.source.value);
          dependencies.push(createModule(absolutePath));
        }
      });
      return dependencies;
    }
  }]);

  return Module;
}();

function createModule(filePath) {
  return new Module(filePath);
}

var _default = createModule;
exports["default"] = _default;