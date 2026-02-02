import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    res.status(200).send({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res.status(400).send({ status: "error", error: "Incomplete values" });

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    const petUpdateBody = req.body;

    const updatedPet = await petsService.update(petId, petUpdateBody);
    res.status(200).send({ status: "success", payload: updatedPet, message: "Pet updated" });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    await petsService.delete(petId);
    res.status(200).send({ status: "success", message: "Pet deleted" });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate)
      return res.status(400).send({ status: "error", error: "Incomplete values" });

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`
    });

    const result = await petsService.create(pet);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const petId = req.params.pid;
    const pet = await petsService.getById(petId); // Usando tu service

    if (!pet) {
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    res.status(200).send({ status: "success", payload: pet });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

export default {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage
};
