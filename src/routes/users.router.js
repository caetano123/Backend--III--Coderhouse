import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

// GET /api/users → obtener todos los usuarios
router.get('/', usersController.getAllUsers);

// GET /api/users/:uid → obtener usuario por ID
router.get('/:uid', usersController.getUser);

// PUT /api/users/:uid → actualizar usuario por ID
router.put('/:uid', usersController.updateUser);

// DELETE /api/users/:uid → eliminar usuario por ID
router.delete('/:uid', usersController.deleteUser);

export default router;
