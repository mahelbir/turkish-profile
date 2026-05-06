import {
    FILES,
    createRng,
    pickWeighted,
    normalizeGender,
    buildUsername,
    buildPassword,
} from "./helper.js";


export function getGender({seed, gender} = {}) {
    return normalizeGender(gender, createRng(seed));
}

export function getFirstName({seed, gender} = {}) {
    return pickWeighted(FILES[getGender({seed, gender})], createRng(seed));
}

export function getLastName({seed} = {}) {
    return pickWeighted(FILES.last, createRng(seed));
}

export function getFullName({seed, gender} = {}) {
    return `${getFirstName({seed, gender})} ${getLastName({seed})}`;
}

export function getUsername({
                                seed,
                                gender,
                                firstName,
                                lastName,
                                maxLength = 15,
                                replacement = "_",
                            } = {}) {
    const first = firstName ?? getFirstName({seed, gender});
    const last = lastName ?? getLastName({seed});
    return buildUsername(createRng(seed), {firstName: first, lastName: last, maxLength, replacement});
}

export function getPassword({
                                seed,
                                length = 8,
                                uppercase = true,
                                lowercase = true,
                                numbers = true,
                                special = false,
                            } = {}) {
    return buildPassword(createRng(seed), {length, uppercase, lowercase, numbers, special});
}

export function getProfile({seed, gender, usernameOptions = {}, passwordOptions = {}} = {}) {
    gender = getGender({seed, gender});
    const firstName = getFirstName({seed, gender});
    const lastName = getLastName({seed});
    const fullName = `${firstName} ${lastName}`;
    const username = getUsername({seed, firstName, lastName, ...usernameOptions});
    const password = getPassword({seed, ...passwordOptions});

    return {
        firstName,
        lastName,
        fullName,
        gender,
        username,
        password,
    };
}