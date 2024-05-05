"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstName = getFirstName;
exports.getFullName = getFullName;
exports.getLastName = getLastName;
exports.getProfile = getProfile;
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _crypto = require("crypto");
var _paths = _interopRequireDefault(require("./paths.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILES = {
  'first:male': fullPath('male_first.csv'),
  'first:female': fullPath('female_first.csv'),
  'last': fullPath('all_last.csv')
};
function fullPath(filename) {
  const dir = _path.default.join(_paths.default.dirname, "../../resources");
  if ((0, _fs.existsSync)(dir)) return _path.default.join(dir, filename);
  return _path.default.join(_paths.default.dirname, "../resources", filename);
}
function getLine(filename) {
  let selected = Math.random();
  let nameFile = (0, _fs.readFileSync)(filename, 'utf-8').split('\n');
  nameFile.shift();
  for (let line of nameFile) {
    let [name, cumulative] = line.split(",");
    if (parseFloat(cumulative) > selected) {
      return name.trim();
    }
  }
  return "";
}
function getUsername(...names) {
  const user = names.join('').replace(/[^a-zA-Z0-9]/g, '_');
  return user.toLowerCase().substring(0, 11) + (0, _crypto.randomInt)(100, 9999);
}
function getEmail(username) {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com'];
  return username + "@" + domains[(0, _crypto.randomInt)(0, 3)];
}
function getPassword(letters = null, length) {
  const hex = (0, _crypto.randomBytes)(Math.ceil(length / 2)).toString('hex').slice(0, length);
  const first = letters?.[(0, _crypto.randomInt)(0, letters?.length)]?.toUpperCase() || 'A';
  return first + hex;
}
function chooseGender(gender) {
  gender = gender || Math.random() <= 0.5 ? 'male' : 'female';
  if (gender !== 'male' && gender !== 'female') {
    throw new Error("Only 'male' and 'female' are supported as gender");
  }
  return gender;
}
function getFirstName(gender = null) {
  gender = chooseGender(gender);
  return getLine(FILES['first:' + gender]);
}
function getLastName() {
  return getLine(FILES['last']);
}
function getFullName(gender = null) {
  return `${getFirstName(gender)} ${getLastName()}`;
}
function getProfile(gender = null, passwordLength = 8) {
  gender = chooseGender(gender);
  const firstName = getFirstName(gender);
  const lastName = getLastName();
  const fullName = `${firstName} ${lastName}`;
  const username = getUsername(firstName, lastName);
  return {
    firstName,
    lastName,
    fullName,
    gender,
    username,
    email: getEmail(username),
    password: getPassword(fullName.replaceAll(' ', '').toLowerCase(), passwordLength)
  };
}