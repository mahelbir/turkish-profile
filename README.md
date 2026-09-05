# Turkish Profile

[![npm version](https://img.shields.io/npm/v/turkish-profile.svg)](https://www.npmjs.com/package/turkish-profile)
[![license](https://img.shields.io/npm/l/turkish-profile.svg)](LICENSE)

Random Turkish name, username, password, and birthdate generator with realistic frequency distributions. Optional gender filtering and seed-based reproducibility.

## Installation

```bash
npm i turkish-profile
```

## Usage

```javascript
// ECMAScript Modules
import {getFirstName, getLastName, getFullName, getUsername, getPassword, getBirthdate, getProfile} from "turkish-profile";

// CommonJS
const {getFirstName, getLastName, getFullName, getUsername, getPassword, getBirthdate, getProfile} = require("turkish-profile");

getFirstName();                               // random first name
getFirstName({gender: "male"});               // male first name
getLastName();                                // random last name
getFullName({gender: "female"});              // female full name
getUsername();                                // e.g. "hasandemir4839"
getPassword({length: 16, special: true});     // 16-char password incl. specials
getBirthdate();                               // Date object, age 20–50 (relative to now)
getProfile();
/*
{
  firstName: "Hasan",
  lastName: "Kaya",
  fullName: "Hasan Kaya",
  gender: "male",
  username: "hasankaya4839",
  password: "Q4lk29bw",
  birthdate: 1994-03-08T21:14:52.000Z   // Date instance
}
*/
```

### Reproducible output with `seed`

Same seed → identical output across runs and across ESM/CJS builds:

```javascript
getProfile({seed: 42});                       // deterministic
getProfile({seed: 42});                       // same as above
getProfile({seed: "any-string"});             // string seeds also supported
```

Without a seed, randomness comes from Node's `crypto.randomInt` (cryptographically secure). With a seed, a deterministic 32-bit PRNG (`mulberry32`) is used — **not cryptographically secure**, by design.

> **Exception:** `birthdate` is never seeded. It is always realistic and relative to the current date.

### Override + compose

```javascript
getProfile({
    seed: 1,
    gender: "female",
    usernameOptions: {maxLength: 20, replacement: "."},
    passwordOptions: {length: 12, special: true},
    birthdateOptions: {minAge: 25, maxAge: 35},
});
```

### Birthdate

`getBirthdate` returns a `Date`. For a Unix timestamp in seconds, use `getBirthdate().getTime() / 1000`.

```javascript
getBirthdate();                               // Date, age 20–50 (relative to now)
getBirthdate({minAge: 18, maxAge: 65});       // custom age window
getBirthdate({                                // explicit bounds — must be Date objects
    minDate: new Date("1980-01-01"),
    maxDate: new Date("1999-12-31"),
});
Math.floor(getBirthdate().getTime() / 1000);  // Unix seconds
```

`minDate` / `maxDate` must be `Date` objects and override the age-derived bounds (`minDate` overrides `maxAge`, `maxDate` overrides `minAge`).

## API

All functions take a single options object. All parameters are optional.

| Function       | Options                                                                                     |
|----------------|---------------------------------------------------------------------------------------------|
| `getGender`    | `{seed, gender}`                                                                            |
| `getFirstName` | `{seed, gender}`                                                                            |
| `getLastName`  | `{seed}`                                                                                    |
| `getFullName`  | `{seed, gender}`                                                                            |
| `getUsername`  | `{seed, gender, firstName, lastName, maxLength = 15, replacement = "_"}`                    |
| `getPassword`  | `{seed, length = 8, uppercase = true, lowercase = true, numbers = true, special = false}`   |
| `getBirthdate` | `{minAge = 20, maxAge = 50, minDate, maxDate}`                                              |
| `getProfile`   | `{seed, gender, usernameOptions = {}, passwordOptions = {}, birthdateOptions = {}}`         |

- `gender`: `"male"` or `"female"`. Omit for random selection.
- `seed`: number or string. Omit for cryptographically secure randomness.
- `getUsername`: characters outside `[a-zA-Z0-9]` (including Turkish `ç`, `ğ`, `ı`, `ö`, `ş`, `ü`) are replaced with `replacement`. `maxLength` includes the 4-digit suffix and must be at least 6.
- `getPassword`: at least one charset must be enabled, and `length` must be at least the number of enabled sets.
- `getBirthdate`: returns a `Date` (use `.getTime() / 1000` for Unix seconds). `minAge` / `maxAge` are relative to the current date; `minDate` / `maxDate` must be `Date` objects and override the age bounds. **Not seeded** — always realistic, even inside `getProfile`.

## Support

If this project helps you, please consider giving it a [Star ⭐️](https://github.com/mahelbir/turkish-profile) on GitHub.
This will encourage us to continue developing and maintaining this project.
