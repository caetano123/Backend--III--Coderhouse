import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const generateMockUsers = (quantity = 1) => {
    const users = [];

    for (let i = 0; i < quantity; i++) {
        users.push({
            _id: new mongoose.Types.ObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: bcrypt.hashSync("coder123", 10),
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets: []
        });
    }

    return users;
};

export const generateMockPets = (quantity = 1) => {
    const pets = [];

    for (let i = 0; i < quantity; i++) {
        pets.push({
            name: faker.animal.petName(),
            specie: faker.animal.type(),
            birthDate: faker.date.past(),
            adopted: false
        });
    }

    return pets;
};
