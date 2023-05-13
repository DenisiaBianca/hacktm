import { checkJwt, checkRole } from "../middlewares";
import { Router } from "express";
import { addNewRead, getAll, getAllById } from "../helpers/counter-helper";

const router = Router();

// Get all counters
/**
 * @swagger
 * /counter:
 *   get:
 *     tags:
 *       - Counter
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
router.get("/", [checkJwt, checkRole(["ADMIN"])], getAll);

// Get all counters
/**
 * @swagger
 * /counter/getCountersByUser:
 *   get:
 *     tags:
 *       - Counter
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
  getAllById
);

// Create a new user
/**
 * @swagger
 * /counter/addRandomData:
 *   post:
 *     tags:
 *       - Counter
 *     summary: Create new data
 *     description: Create new data
 *     responses:
 *       200:
 *         description: Session ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post("/addRandomData", addNewRead);

export default router;
