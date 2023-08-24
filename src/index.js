const { readFileSync } = require('fs');
const { resolve, dirname } = require('path');
const { randomInt, randomBytes } = require('crypto');

function fullPath(filename) {
    return resolve(__dirname, filename);
}

const FILES = {
    'first:male': fullPath('male_first.csv'),
    'first:female': fullPath('female_first.csv'),
    'last': fullPath('all_last.csv'),
};

function getName(filename) {
    let selected = Math.random();
    let nameFile = readFileSync(filename, 'utf-8').split('\n');
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
    return user.toLowerCase().substring(0, 11) + randomInt(100, 9999);
}

function getEmail(username) {
    const domains = ['gmail.com', 'hotmail.com', 'outlook.com'];
    return username + "@" + domains[randomInt(0, 3)];
}

function getPassword(letters = null) {
    const length = 8;
    const hex = randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
    const first = letters?.[randomInt(0, letters?.length)]?.toUpperCase() || 'A';
    return first + hex;
}

function selectGender(gender) {
    if (!gender) {
        gender = Math.random() < 0.5 ? 'male' : 'female';
    }
    if (gender !== 'male' && gender !== 'female') {
        throw new Error("Only 'male' and 'female' are supported as gender");
    }
    return gender;
}

function getFirstName(gender = null) {
    gender = selectGender(gender);
    return getName(FILES['first:' + gender]);
}

function getLastName() {
    return getName(FILES['last']);
}

function getFullName(gender = null) {
    return `${getFirstName(gender)} ${getLastName()}`;
}

function getProfile(gender = null) {
    gender = selectGender(gender);
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
        password: getPassword(fullName.replaceAll(' ', '').toLowerCase())
    }
}

module.exports = {
    getFirstName,
    getLastName,
    getFullName,
    getProfile
};
