const {getFirstName, getLastName, getFullName, getProfile} = require('../src/index');

console.log("===== RANDOM =====")
console.log("FIRST NAME:", getFirstName())
console.log("LAST NAME:", getLastName())
console.log("FULL NAME:", getFullName())
console.log("PROFILE:")
console.log(getProfile());

console.log("===== MALE =====")
console.log("FIRST NAME:", getFirstName('male'))
console.log("FULL NAME:", getFullName('male'))
console.log("PROFILE:")
console.log(getProfile('male'));

console.log("===== FEMALE =====")
console.log("FIRST NAME:", getFirstName('female'))
console.log("FULL NAME:", getFullName('female'))
console.log("PROFILE:")
console.log(getProfile('female'));