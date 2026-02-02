import { Router } from "express";
import { generateMockUsers, generateMockPets } from "../utils/mocking.js";
import { usersService, petsService } from "../services/index.js";

const router = Router();

// GET /api/mocks/mockingusers
router.get("/mockingusers", async (req, res) => {
    const users = generateMockUsers(50);
    res.send({ status: "success", payload: users });
});

// GET /api/mocks/mockingpets (si ya existía, lo movés acá)
router.get("/mockingpets", (req, res) => {
    const pets = generateMockPets(100);
    res.send({ status: "success", payload: pets });
});

// POST /api/mocks/generateData
router.post("/generateData", async (req, res) => {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = generateMockUsers(users);
    const mockPets = generateMockPets(pets);

    await usersService.createMany(mockUsers);
    await petsService.createMany(mockPets);

    res.send({
        status: "success",
        message: "Data generated successfully",
        users: users,
        pets: pets
    });
});

export default router;
