"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const apikey_middleware_1 = require("../middlewares/apikey.middleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', UserController_1.userController.get);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     parameters:
 *       - name: apikey
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: firstname
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 example: hash password
 *               role:
 *                 type: string
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created
*/
router.post('/', apikey_middleware_1.apikeyMiddleware, UserController_1.userController.create);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - name: apikey
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       201:
 *         description: User created
*/
router.delete('/:id', apikey_middleware_1.apikeyMiddleware, UserController_1.userController.delete);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - name: apikey
 *         in: header
 *         description: ''
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: firstname
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 example: hash password
 *     responses:
 *       201:
 *         description: User created
*/
router.post('/', apikey_middleware_1.apikeyMiddleware, UserController_1.userController.update);
exports.default = router;
