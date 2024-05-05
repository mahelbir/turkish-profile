import {getFirstName, getLastName, getFullName, getProfile} from "../src/index.js";

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