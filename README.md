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
First Name: ORHAN
Last Name: BEKIROGLU
Full Name: AYSE KULA
Profile: {
  firstName: 'AHMET',
  lastName: 'ORAK',
  fullName: 'AHMET ORAK',
  gender: 'male',
  username: 'ahmetorak4481',
  email: 'ahmetorak4481@hotmail.com',
  password: 'Ob30c80cb'
}
===== OPTIONS =====
First Name: HALIL
Last Name: YARDIMCI
Full Name: ZEYNEP ACAR
Profile: {
  firstName: 'FERIDE',
  lastName: 'COLAK',
  fullName: 'FERIDE COLAK',
  gender: 'female',
  username: 'feridecolak1516',
  email: 'feridecolak1516@gmail.com',
  password: 'E07044caaa6717262' // 16 characters
}
 */
```

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.