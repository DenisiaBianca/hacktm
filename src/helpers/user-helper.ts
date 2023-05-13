import { Request, Response } from "express";
import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";

export const listAll = async (req: Request, res: Response) => {
  // Get users from database
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find({
    select: ["id", "username", "role"], // We dont want to send the passwords on response
  });

  // Send the users object
  res.send(users);
};

export const getOneById = async (req: Request, res: Response) => {
  // Get the ID from the url
  const id: number = Number(req.params.id);

  // Get the user from database
  const userRepository = AppDataSource.getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail({
      where: { id },
      select: ["id", "username", "role"], // We dont want to send the password on response
    });
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  res.json(user);
};

export const newUser = async (req: Request, res: Response) => {
  // Get parameters from the body
  const { username, password, role } = req.body;
  console.log(req.body);
  const user = new User();
  user.username = username;
  user.encryptedPassword = password;
  user.role = role;
  // Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  // Hash the password, to securely store on DB
  user.hashPassword();

  // Try to save. If fails, the username is already in use
  // const userRepository = AppDataSource.getRepository(User);
  try {
    await AppDataSource.manager.save(user);
  } catch (e) {
    console.log(e);
    res.status(409).send("username already in use");
    return;
  }

  // If all ok, send 201 response
  res.status(201).send("User created");
};

export const addUserFromPersonalData = async (
  username: string,
  password: string,
  role: any,
  personalDataId: number
) => {
  // Get parameters from the body
  const user = User.create({
    username,
    encryptedPassword: password,
    role,
    personalDataId,
  });

  // Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    console.log(errors);
    return;
  }

  // Hash the password, to securely store on DB
  user.hashPassword();

  // Try to save. If fails, the username is already in use
  // const userRepository = AppDataSource.getRepository(User);
  let userResponse: User;
  try {
    userResponse = await AppDataSource.manager.save(user);
  } catch (e) {
    console.log(e);
    return;
  }

  return userResponse;
};
export const editUser = async (req: Request, res: Response) => {
  // Get the ID from the url
  const id = req.params.id;

  // Get values from the body
  const { username, role } = req.body;

  // Try to find user on database
  const userRepository = AppDataSource.getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail({ where: { id: Number(id) } });
  } catch (error) {
    // If not found, send a 404 response
    res.status(404).send("User not found");
    return;
  }

  // Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  // Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }
  // After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

export const deleteUser = async (req: Request, res: Response) => {
  // Get the ID from the url
  const id = req.params.id;

  const userRepository = AppDataSource.getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail({
      where: { id: Number(id) },
    });
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  await userRepository.delete(id);

  // After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
