import { usersService } from "../services/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.status(200).send({ status: "success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    res.status(200).send({ status: "success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    const result = await usersService.update(userId, updateBody);
    res.status(200).send({ status: "success", payload: result, message: "User updated" });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    await usersService.delete(userId);
    res.status(200).send({ status: "success", message: "User deleted" });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};
