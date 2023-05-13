import { CounterRead } from "../entity/counter-read";
import { CounterTypeEnum } from "./enum";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export const addCount = async (
  type: CounterTypeEnum,
  userId: number,
  value: number
) => {
  // Get parameters from the body
  const counterRead = new CounterRead();
  counterRead.type = type;
  counterRead.userId = userId;
  counterRead.value = value;
  try {
    await AppDataSource.manager.save(counterRead);
  } catch (e) {
    console.log(e);
  }
  // Validade if the parameters are ok
};

export const getAll = async (req: Request, res: Response) => {
  // Get ID from JWT
  const id = res.locals.jwtPayload.userId;

  const counterRepository = AppDataSource.getRepository(CounterRead);
  const counters = await counterRepository.find({});

  res.json(counters);
};

export const getAllById = async (req: Request, res: Response) => {
  // Get ID from JWT
  const id = res.locals.jwtPayload.userId;

  const counterRepository = AppDataSource.getRepository(CounterRead);
  const counters = await counterRepository.find({
    where: {
      userId: id,
    },
  });

  res.json(counters);
};

export const addNewRead = async (req: Request, res: Response) => {
  const counterRead = CounterRead.create({
    value: 1,
    userId: 1,
    type: CounterTypeEnum.water,
  });
  console.log("h");

  const response = await AppDataSource.manager.save(counterRead);
  return res.status(200).send(response);
};
