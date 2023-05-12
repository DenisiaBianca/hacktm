import { checkJwt, checkRole } from "../middlewares";
import { deleteUser, editUser, getOneById, listAll, newUser } from "../helpers";
import { Router } from "express";

const router = Router();

// Get all users
/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: get all users
 *     description: get all users
 *     responses:
 *       200:
 *         description: users
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.get("/", [checkJwt, checkRole(["ADMIN"])], listAll);

// Get one user
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get  user
 *     description: Get  user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: user id
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.get("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], getOneById);

// Create a new user
/**
 * @swagger
 * /user/add:
 *   post:
 *     tags:
 *       - User
 *     summary: Create new user
 *     description: Create new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Session ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  username:
 *                    type: string
 *                    example: Ion
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post("/add", [checkJwt, checkRole(["ADMIN"])], newUser);

// Edit one user
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Edit  user
 *     description: Edit  user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: user id
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: ADMIN
 *               username:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: Session ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  token:
 *                    type: string
 *                    example: user updated
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.patch("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], editUser);

// Delete one user
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete  user
 *     description: Delete  user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: user id
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Session ID
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 *                example: user deleted
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.delete("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], deleteUser);

export default router;
