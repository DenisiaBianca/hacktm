import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

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
  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;

    const user = Object.assign(new User(), {
      firstName,
      lastName,
      age,
    });

    return this.userRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.userRepository.remove(userToRemove);

    return "user has been removed";
  }
}
