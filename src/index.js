import path from "path";
import {readFileSync, existsSync} from "fs";
import {randomInt, randomBytes} from "crypto";

import paths from "./paths.js";


const FILES = {
    'first:male': fullPath('male_first.csv'),
    'first:female': fullPath('female_first.csv'),
    'last': fullPath('all_last.csv'),
};

function fullPath(filename) {
    const dir = path.join(paths.dirname, "../../resources");
    if (existsSync(dir))
        return path.join(dir, filename);
    return path.join(paths.dirname, "../resources", filename);
}

function getLine(filename) {
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

function getPassword(letters = null, length) {
    const hex = randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    const first = letters?.[randomInt(0, letters?.length)]?.toUpperCase() || 'A';
    return first + hex;
}

function chooseGender(gender) {
    gender = gender || (randomInt(2) === 0 ? 'female' : 'male');
    if (gender !== 'male' && gender !== 'female') {
        throw new Error("Only 'male' and 'female' are supported as gender");
    }
    return gender;
}

export function getFirstName(gender = null) {
    gender = chooseGender(gender);
    return getLine(FILES['first:' + gender]);
}

export function getLastName() {
    return getLine(FILES['last']);
}

export function getFullName(gender = null) {
    return `${getFirstName(gender)} ${getLastName()}`;
}

export function getProfile(gender = null, passwordLength = 8) {
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
    }
}