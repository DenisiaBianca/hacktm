import { checkJwt } from "../middlewares";
import { changePassword, login } from "../helpers";
import { Router } from "express";

const router = Router();

// Login route
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Create new user
 *     description: Create new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin
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
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiSW9uZWwiLCJpYXQiOjE2NTU2NjY5NjIsImV4cCI6MTY1OTI2Njk2Mn0.mTldmoCKeE2ywrqGeJHNZ3P9eXdxpYiThzB3HarUBX0
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post("/login", login);

// Change my password
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: change password
 *     description: change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: a
 *               oldPassword:
 *                 type: string
 *                 example: parola01
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
 *                    example: passport changed
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post("/change-password", [checkJwt], changePassword);

export default router;
