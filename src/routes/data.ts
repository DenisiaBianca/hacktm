import { getAllData, getUserData, homeAlone } from "../helpers/data-helper";
import { checkJwt, checkRole } from "../middlewares";
import { Router } from "express";

const router = Router();
// Get all counters
/**
 * @swagger
 * /data/getCountersByUser:
 *   get:
 *     tags:
 *       - Data
 *     summary: get all counters by Id
 *     description: get all counters by Id
 *     responses:
 *       200:
 *         description: counterReads
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterRead'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.get(
  "/getCountersByUser",
  [checkJwt, checkRole(["USER", "ADMIN"])],
  getUserData
);

// Get all counters
/**
 * @swagger
 * /data/getCounters:
 *   get:
 *     tags:
 *       - Data
 *     summary: get all counters
 *     description: get all counters
 *     responses:
 *       200:
 *         description: counterReads
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CounterRead'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.get("/getCounters", [checkJwt, checkRole(["ADMIN"])], getAllData);

/**
 * @swagger
 * /data/homeAlone:
 *   post:
 *     tags:
 *       - Data
 *     summary: Set left home
 *     description: Set left home
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               homeAlone:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post("/homeAlone", [checkJwt, checkRole(["USER", "ADMIN"])], homeAlone);

export default router;
