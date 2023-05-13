/**
 * @swagger
 * components:
 *   schemas:
 *     CounterRead:
 *       type: object
 *       properties:
 *         type:
 *            type: string
 *            example: gas
 *         userId:
 *            type: string
 *            example: userId
 *         value:
 *            type: number
 *            example: 0
 *         date:
 *            type: Date
 *            example: 12.03.1997
 */
export interface CounterRead {
  type: "gas" | "water" | "electricity";
  id: number;
  userId: number;
  date: Date;
  value: number;
}
