# Turkish Profile

Random Turkish name, username, and password generator with realistic frequency distributions. Optional gender filtering and seed-based reproducibility.

## Installation

```bash
npm i turkish-profile
```

## Usage

```javascript
// ECMAScript Modules
import {getFirstName, getLastName, getFullName, getUsername, getPassword, getProfile} from "turkish-profile";

// CommonJS
const {getFirstName, getLastName, getFullName, getUsername, getPassword, getProfile} = require("turkish-profile");

getFirstName();                               // random first name
getFirstName({gender: "male"});               // male first name
getLastName();                                // random last name
getFullName({gender: "female"});              // female full name
getUsername();                                // e.g. "hasandemir4839"
getPassword({length: 16, special: true});     // 16-char password incl. specials
getProfile();
/*
{
  firstName: "Hasan",
  lastName: "Kaya",
  fullName: "Hasan Kaya",
  gender: "male",
  username: "hasankaya4839",
  password: "Q4lk29bw"
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

### Override + compose

```javascript
getProfile({
    seed: 1,
    gender: "female",
    usernameOptions: {maxLength: 20, replacement: "."},
    passwordOptions: {length: 12, special: true},
});
```

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
| `getProfile`   | `{seed, gender, usernameOptions = {}, passwordOptions = {}}`                                |

- `gender`: `"male"` or `"female"`. Omit for random selection.
- `seed`: number or string. Omit for cryptographically secure randomness.
- `getUsername`: characters outside `[a-zA-Z0-9]` (including Turkish `ç`, `ğ`, `ı`, `ö`, `ş`, `ü`) are replaced with `replacement`. `maxLength` includes the 4-digit suffix and must be at least 6.
- `getPassword`: at least one charset must be enabled, and `length` must be at least the number of enabled sets.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.