# Turkish Profile

Random Turkish profile generator with realistic probabilities, capable of generating names, emails, and passwords either
randomly or based on gender

## Installation

To install use npm:

```bash
npm i turkish-profile
```

## Usage

```javascript
// const {getFirstName, getLastName, getFullName, getProfile} = require("turkish-profile");
import {getFirstName, getFullName, getLastName, getProfile} from "turkish-profile";


console.log("===== RANDOM =====")
console.log("First Name:", getFirstName());
console.log("Last Name:", getLastName());
console.log("Full Name:", getFullName());
console.log("Profile:", getProfile());

console.log("===== OPTIONS =====")
console.log("First Name:", getFirstName("male"));
console.log("Last Name:", getLastName());
console.log("Full Name:", getFullName("female"));
console.log("Profile:", getProfile("male", 16));

/*
===== RANDOM =====
First Name: HARUN
Last Name: ALTAY
Full Name: GONUL SURER
Profile: {
  firstName: 'SAFFET',
  lastName: 'USTUN',
  fullName: 'SAFFET USTUN',
  gender: 'female',
  username: 'saffetustun8659',
  email: 'saffetustun8659@outlook.com',
  password: 'Na0e789a3'
}

===== OPTIONS =====
First Name: HALIL
Last Name: GERENLI
Full Name: ARIF TAPAN
Profile: {
  firstName: 'NAIL',
  lastName: 'KARA',
  fullName: 'NAIL KARA',
  gender: 'male',
  username: 'nailkara6939',
  email: 'nailkara6939@outlook.com',
  password: 'I3722a305a65f3ffe' // 16 characters
}
 */
```

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.