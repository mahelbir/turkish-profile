# Turkish Profile

Random Turkish profile generator with realistic probabilities. You can generate name, email and password randomly or gender-specific.

## Installation

To install use npm:

```bash
npm i turkish-profile
```

## Usage

```javascript
const {getFirstName, getLastName, getFullName, getProfile} = require('turkish-profile');

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

/*
===== RANDOM =====
FIRST NAME: NURCAN
LAST NAME: DEMIRAL
FULL NAME: ALI AKGUN
PROFILE:
{
  firstName: 'CANSU',
  lastName: 'TOKTAS',
  fullName: 'CANSU TOKTAS',
  gender: 'female',
  username: 'cansutoktas8997',
  email: 'cansutoktas8997@gmail.com',
  password: 'Sdb642f73'
}
===== MALE =====
FIRST NAME: MEHMET
FULL NAME: NURULLAH YERGIN
PROFILE:
{
  firstName: 'YILMAZ',
  lastName: 'AKSOY',
  fullName: 'YILMAZ AKSOY',
  gender: 'male',
  username: 'yilmazaksoy4151',
  email: 'yilmazaksoy4151@outlook.com',
  password: 'Md3204d08'
}
===== FEMALE =====
FIRST NAME: IKBAL
FULL NAME: SENAY ASCI
PROFILE:
{
  firstName: 'CENNET',
  lastName: 'SAHINBAS',
  fullName: 'CENNET SAHINBAS',
  gender: 'female',
  username: 'cennetsahin1294',
  email: 'cennetsahin1294@gmail.com',
  password: 'A1acb47d8'
}

 */
```

## License

The MIT License (MIT). Please see [License File](LISENCE) for more information.