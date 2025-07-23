import express from 'express'
import { userController } from '../controllers/UserController';
import {apikeyMiddleware}  from '../middlewares/apikey.middleware';
const router= express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */

router.get('/',userController.get);
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
router.post('/', apikeyMiddleware , userController.create);

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
router.delete('/:id', apikeyMiddleware , userController.delete);

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
router.post('/', apikeyMiddleware , userController.update);

export default router;
