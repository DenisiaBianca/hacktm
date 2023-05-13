import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CounterRead } from "../entity/counter-read";
import { CounterTypeEnum } from "./enum";
import { Between } from "typeorm";
import { IDailyUsage, IData, IHomeData } from "../interfaces";
import { client } from "../index";

export const getUserData = async (req: Request, res: Response) => {
  const id = res.locals.jwtPayload.userId;

  const counterRepository = AppDataSource.getRepository(CounterRead);

  const gasCounters = await counterRepository.find({
    where: {
      userId: id,
      type: CounterTypeEnum.gas,
      date: Between(new Date(2023, 4, 1), new Date()),
    },
    order: {
      date: "DESC",
    },
    take: 24,
  });
  const waterCounters = await counterRepository.find({
    where: {
      userId: id,
      type: CounterTypeEnum.water,
      date: Between(new Date(2023, 4, 1), new Date()),
    },
    take: 30,
    order: {
      date: "DESC",
    },
  });
  const dailyGasUsage: IDailyUsage[] = [];
  const dailyWaterUsage: IDailyUsage[] = [];

  const orderedGasCounters = gasCounters.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  orderedGasCounters.forEach((data, i) =>
    dailyGasUsage.push({
      day: data.date,
      value: data.value - orderedGasCounters[i > 0 ? i - 1 : i].value,
    })
  );
  waterCounters.forEach((data) =>
    dailyWaterUsage.push({ day: data.date, value: data.value })
  );

  try {
    let gasData: IData;

    if (gasCounters.length > 0) {
      gasData = {
        currentRead: gasCounters[gasCounters.length - 1].value,
        monthTotal:
          gasCounters[gasCounters.length - 1].value - gasCounters[0].value,
        dailyUsage: dailyGasUsage,
      };
    }

    let waterData: IData;
    if (waterCounters.length > 0) {
      waterData = {
        currentRead: waterCounters[waterCounters.length - 1].value,
        monthTotal:
          waterCounters[waterCounters.length - 1].value -
          waterCounters[0].value,
        dailyUsage: dailyWaterUsage,
      };
    }

    return res.json({ gasData: gasData, waterData: waterData });
  } catch (e) {
    console.log(e);
  }
};

export const getAllData = async (req: Request, res: Response) => {
  const id = res.locals.jwtPayload.userId;

  const counterRepository = AppDataSource.getRepository(CounterRead);

  const gasCounters = await counterRepository.find({
    where: {
      type: CounterTypeEnum.gas,
      date: Between(new Date(2023, 4, 1), new Date()),
    },
    order: {
      date: "DESC",
    },
  });
  const waterCounters = await counterRepository.find({
    where: {
      type: CounterTypeEnum.water,
      date: Between(new Date(2023, 4, 1), new Date()),
    },
    order: {
      date: "DESC",
    },
  });
  let gasUsages = [];
  let waterUsages = [];
  const userIds = gasCounters.map((t) => t.userId);
  let filteredUserIds = [];
  userIds.forEach(
    (id) => !filteredUserIds.includes(id) && filteredUserIds.push(id)
  );

  filteredUserIds.forEach((id) => {
    const filteredUsage = gasCounters
      .filter((t) => t.userId === id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    if (filteredUsage.length != 0) {
      const usage =
        filteredUsage[0].value - filteredUsage[filteredUsage.length - 1].value;
      gasUsages.push({ id: id, usage: usage });
    }
  });

  filteredUserIds.forEach((id) => {
    const filteredUsage = waterCounters
      .filter((t) => t.userId === id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    if (filteredUsage.length != 0) {
      const usage =
        filteredUsage[0].value - filteredUsage[filteredUsage.length - 1].value;
      waterUsages.push({ id: id, usage: usage });
    }
  });

  return res.json({ gas: gasUsages, water: waterUsages });
};

export const homeAlone = async (req: Request, res: Response) => {
  const id = res.locals.jwtPayload.userId;
  const { homeAlone } = req.body;
  client.publish(
    "homeAlone",
    homeAlone ? "1" : "0",
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
  return res.send("ok");
};
