import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import config from "../../config/config";

export const login = async (req: Request, res: Response) => {
  // Check if username and password are set
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).send();
  }
  // Get user from database
  let user: User;
  try {
    user = await AppDataSource.getRepository(User).findOneBy({
      username: username as string,
    });
  } catch (error) {
    return res.status(404).send("Userul nu exista.");
  }

  // Check if encrypted password match
  if (!user.checkIfUnencryptedPasswordIsValid(password)) {
    return res.status(401).send("Parola este incorecta.");
  }

  // Sing JWT, valid for 1 hour
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    config.jwtSecret,
    {
      expiresIn: "10d",
    }
  );

  // Send the jwt in the response
  res.send({ token });
};

export const changePassword = async (req: Request, res: Response) => {
  // Get ID from JWT
  const id = res.locals.jwtPayload.userId;

  // Get parameters from the body
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword && newPassword)) {
    res.status(400).send();
  }

  let user: User;
  try {
    user = await AppDataSource.getRepository(User).findOneByOrFail({
      id,
    });
  } catch (id) {
    res.status(401).send();
    return;
  }

  // Check if old password matchs
  if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
    res.status(401).send();
    return;
  }

  // Validate de model (password lenght)
  user.encryptedPassword = newPassword;
  const errors = await validate(user);

  if (errors.length > 0) {
    console.log(errors);
    res.status(400);
    return;
  }
  // Hash the new password and save
  user.hashPassword();
  try {
    await AppDataSource.manager.save(user);
  } catch (e) {
    res.status(400).send("Something went wrong...");
    return;
  }
  // await AppDataSource.manager.save(user);

  res.status(204).send();
};
