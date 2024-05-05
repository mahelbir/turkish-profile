"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _url = require("url");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isESM = typeof __filename === 'undefined';
const getDirnameFilename = () => {
  const filename = (0, _url.fileURLToPath)(require('url').pathToFileURL(__filename).toString());
  const dirname = _path.default.dirname(filename);
  return {
    dirname,
    filename
  };
};
var _default = exports.default = isESM ? getDirnameFilename() : {
  dirname: __dirname,
  filename: __filename
};