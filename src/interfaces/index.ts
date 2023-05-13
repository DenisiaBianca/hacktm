/**
 * @swagger
 * components:
 *   schemas:
 *     ApiError:
 *       type: object
 *       properties:
 *         status:
 *            type: string
 *            example: error
 *         message:
 *            type: string
 *            description: Error message
 *            example: Error message
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                value:
 *                  type: string
 *                  description: Value of invalid field
 *                msg:
 *                  type: string
 *                  description: Error message
 *                  example: Invalid value
 *                param:
 *                  type: string
 *                  description: Invalid field name
 *                  example: category
 *                location:
 *                  type: string
 *                  description: Location of invalid fields (query or params)
 *                  example: params
 */

export * from "./user";
export * from "./data";
export * from "./counter-read";
