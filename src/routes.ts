import { UserController } from "./controller/user-controller";

export const Routes = [
  /**
   * @swagger
   * tags:
   *    name: Country
   * /countries:
   *   get:
   *     tags:
   *       - Country
   *     summary: Retrieve a list of countries
   *     description: Retrieve a list of enabled countries from Pimcore
   *     responses:
   *       200:
   *         description: A list of countries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                  $ref: '#/components/schemas/Country'
   *       500:
   *         description: Error message
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/ApiError'
   */
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
  },
];
