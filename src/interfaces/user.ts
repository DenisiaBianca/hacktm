/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *            type: string
 *            example: Ionel
 *         password:
 *            type: string
 *            example: parola01
 *         role:
 *            type: string
 *            example: admin
 */
export interface IUser {
  username: string;
  password: string;
  role: string;
}
